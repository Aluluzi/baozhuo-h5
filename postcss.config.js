// module.exports = {
//   plugins: {
//     'autoprefixer': {
//       overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7']
//     },
//     'postcss-pxtorem': {
//       rootValue:37.5,
//       propList: ['*']
//     }
//   }
// }

const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')

module.exports = ({ file }) => {
  let rootValue
  if (file && file.dirname && file.dirname.indexOf('vant') > -1) {
    rootValue = 16
  } else {
    rootValue = 32
  }
  // if (file && file.dirname && file.dirname.indexOf("vant") > -1) { rootValue = 37.5; } else { rootValue = 75; }
  return {
    plugins: [
      autoprefixer(),
      pxtorem({
        rootValue: rootValue,
        propList: ['*'],
        minPixelValue: 2
      })
    ]
  }
}