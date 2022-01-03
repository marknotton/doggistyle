# Installation

Install the [NPM pacakge](https://www.npmjs.com/package/@doggistyle/sass) inside to your project:

```bash
npm i @doggistyle/sass
```

## Setup

Depending on how you're processing your Sass, you may find it advantages to include a
few [includePaths](https://sass-lang.com/documentation/js-api/interfaces/LegacyStringOptions#includePaths) 
to make using Doggistyle a little cleaner. Sass's JavaScript API accepts an array of paths that is searched to match a stylehseet if it exists. Here is how you might impliment the paths via a Gulp task for example:

```js
.pipe(sass({
  includePaths : [
    process.env.PWD + `/node_modules/@doggistyle/sass/library/src/`,
    process.env.PWD + `/node_modules/@doggistyle/sass/library/src/elements/`,
    process.env.PWD + `/node_modules/@doggistyle/sass/library/src/variables/`,
    process.env.PWD + `/node_modules/@doggistyle/sass/library/src/helpers/`
  ]    
}))
```

!> From here-on-out, any code documentation examples refering to the inclusion of any Doggistyle resources 
via an at-rule assumes you have set up your Include Paths. If you haven't; you must prefix the root
paths with every stylesheet request. Example: `@forward "/node_modules/@doggistyle/sass/library/src/doggistyle";`

## Initialise

Unlike other frameworks or libaries, instantiating Doggistyle won't polute your project
with a myriad of potentially unused delcartion blocks. Instead we leverage the power of Sass's
[@forward](https://sass-lang.com/documentation/at-rules/forward) and [@use](https://sass-lang.com/documentation/at-rules/use)
at-rules to define variables, mixins, and functions on a per module basis. It's up to you to assign these
to your own project, with your own naming conventions, and within your own components. 

The following essentially just permits your module access
to all the default $variables, @mixins, and @functions.

```css
@forward "doggistyle";
```

