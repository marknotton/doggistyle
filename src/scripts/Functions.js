
let Helpers = require('./Helpers')
let Doggistyle = require('./Doggistyle')

let sass
let options

class Functions {

  constructor(opts, compiler) {

    Helpers.log('Functions')

    Doggistyle.sass = sass = compiler
    Doggistyle.options = options = opts

    let results = Helpers.getSassFunctions(this)
    return results
 
  }


  // var() {

  //   let result = []

  //   for ( let [index, value] of Object.entries(Doggistyle.getArglist(arguments)) ) {
  //     if ( typeof value == 'string' && value.startsWith('--') && !index) {
  //       result.push((`var(${value})`))
  //     }
  //     // console.log(value)
  //   }

  //   return Doggistyle.create(`var(--test)`)
  // }
//   defaults(args) {

//     // console.log(num)
//     // let number = Helpers.cast.Number(23, 'px')

//     // Helpers.data(number, (value, type) => {
//     // })
//     // number = Helpers.cast.string(number)

//     let number = 40
//     let number2 = '50px'
//     let colorRGB1 = [100, 200, 65, 0.5]
//     let colorRGB2 = 'rgb(33, 100, 122)'
//     let string = "Hello World"
//     let array = ['one', 222, '40px', true]
//     let object = { foo : 'bar', time : 234, theme : '#282C34'}
//     let boolean = true
//     let falsy = null

//     number    = Doggistyle.create(number)
//     number2   = Doggistyle.create(number2)
//     colorRGB1 = Doggistyle.create(colorRGB1)
//     string    = Doggistyle.create(string)
//     array     = Doggistyle.create(array)
//     object    = Doggistyle.create(object)
//     boolean   = Doggistyle.create(boolean)
//     falsy     = Doggistyle.create(falsy)

//     // console.log(Doggistyle.getType(num))
//     // console.log(Doggistyle.getType(number))
//     // console.log(Doggistyle.getType(number2))
//     // console.log(Doggistyle.getType(colorRGB1))
//     // console.log(Doggistyle.getType(string))
//     // console.log(Doggistyle.getType(array))
//     // console.log(Doggistyle.getType(object))
//     // console.log(Doggistyle.getType(boolean))
//     // console.log(Doggistyle.getType(falsy))

//     // console.log(number)

//     // Doggistyle.update(colour, {
//     //   value : '#282C34',
//     //   alpha : 0.2,
//     // }) 

// console.log(Doggistyle.getValue(args.getValue(0)))

//     // Doggistyle.update(args, { 
//     //   unit : 50,
//     //   fontSize : {
//     //     unit : 'rem'
//     //   },
//     //   theme :  {
//     //     value : '#990000'
//     //   },
//     //   colour : '#D1B384',
//     //   heading : {
//     //     value : (value) => { return value + ', I am here!' }
//     //   },
//     //   list : { value : [1, 2, 3, 4, 5, 6] },
//     //   map : () => {
//     //     console.log("DFG")
//     //     // console.log('MAP', arguments['pink'] = "#ffffff")
//     //     return arguments
//     //   }
//     //   // ,
//     //   // array :  {
//     //   //   value : (list) => { return list.setValue(1, new sass.types.Number(18, "px")) },
//     //   // }
//     // }) 
    
//     // console.log(args.getValue(6))
//     // console.log(args.getValue(1))
//     // console.log(args.getValue(2))
//     // console.log(args)

//     // console.log(Doggistyle.update(number2))
//     // console.log(Doggistyle.update(colorRGB1))
//     // console.log(Doggistyle.update(string))
//     // console.log(Doggistyle.update(array))
//     // console.log(Doggistyle.update(object))
//     // console.log(Doggistyle.update(boolean))
//     // console.log(Doggistyle.update(falsy))

//     // console.log(!isNaN(number2), Helpers.units.all.find(unit => number2.endsWith(unit)))
//     // parseInt(hexString, 16)
//     // console.log(Helpers.data(['one', Helpers.cast.colour('AC7DD1'), Helpers.cast.string('HELLO WORLD'), 4], {
//     //   value : true
//     // }))

//     // let colour = Helpers.cast.colour()
//     // let colour = Helpers.data('#Hello World', {
//     //   value : '#282C34',
//     //   alpha : 0.2,
//     // })

//     // console.log(colour)
//     // Helpers.data(number, {
//     //   value : (value) => { return value * 2 },
//     //   unit : 'ss'
//     // })

//     // number = this.double(number)
    

//     return new sass.types.Color(0xff6b717f)
//   }

//   double(number) {
//     return Helpers.data(number, {
//       value : (value) => { return value * 2 },
//       unit : 'px'
//     })
//   }
}

module.exports = (...args) => { return new Functions(...args) }