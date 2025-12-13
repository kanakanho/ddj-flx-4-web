import antfu from '@antfu/eslint-config'
import reactCompiler from 'eslint-plugin-react-compiler'

export default antfu({
  react: true,
  typescript: true,
  yaml: false,
}, {
  plugins: {
    'react-compiler': reactCompiler,
  },
})
