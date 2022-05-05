import VMarkRenderer from '@vmark/core'
import type { Plugin } from 'vite'

const mdRegex = /\.md$/

export default function plugin(): Plugin {
  const renderer = new VMarkRenderer({
    h(name, attr, children) {
      return {
        text: `h("${name}", ${JSON.stringify(attr)}, [${children?.map(
          (c) => c.text || JSON.stringify(c),
        )}])`,
      }
    },
  })
  return {
    name: '@vmark/vite-plugin',
    async transform(src, id) {
      if (!mdRegex.test(id)) {
        return
      }
      let code = `import { h } from 'vue'\n`
      const { text } = await renderer.render(src)
      code += text
      code += `\nexport default {}`
      return code
    },
  }
}
