# Installation

Install the [NPM pacakge](https://www.npmjs.com/package/@doggistyle/sass) inside to your project:

```bash
npm i @doggistyle/sass
```

## Setup

Depending on how you're processing your Sass, you may find it advantages to include a
few [includePaths](https://sass-lang.com/documentation/js-api/interfaces/LegacyStringOptions#includePaths) 
to make using Doggistyle a little cleaner. Sass's JavaScript API accepts an array of paths that is searched to match a stylehseet if it exists. Here is an example on how you might impliment the paths:

```js
sass({
  includePaths : [
    process.env.PWD + `/node_modules/@doggistyle/sass/library/src/`,
    process.env.PWD + `/node_modules/@doggistyle/sass/library/src/elements/`,
    process.env.PWD + `/node_modules/@doggistyle/sass/library/src/variables/`,
    process.env.PWD + `/node_modules/@doggistyle/sass/library/src/helpers/`
  ]    
})
```

!> From here-on-out, any documentation snippets refering to the inclusion of any Doggistyle resources 
via an at-rule assumes you have set up your Include Paths. If you haven't; you must prefix the root
paths with every stylesheet request. Example: `@forward "/node_modules/@doggistyle/sass/library/src/doggistyle";`

## Initialise

Unlike other frameworks or libaries, instantiating Doggistyle won't polute your project
with a myriad of potentially unused delcaration blocks. Instead we leverage the power of Sass's
[@forward](https://sass-lang.com/documentation/at-rules/forward) and [@use](https://sass-lang.com/documentation/at-rules/use)
at-rules to define variables, mixins, and functions on a per stylesheet basis. 

The following essentially permits your stylesheet access
to all the default $variables, @mixins, and @functions. 
This must be included in every stylesheet where you require the power of Doggistyle to be available.


```css
@forward "doggistyle";
```

