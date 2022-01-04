# Grid

Grid layout types are an extendable column template ruleset; each type defines a fundamental pattern to be extended on a component level. 

## Base

The base rule is intended for use on a global container (normally the `<body>` element). 
The columns will break down responsively like the '[Wrap](#wrap)' grid layout type; the only difference 
is a column will be assigned to the start and end of the column template. These additional
columns behave like gutters and will push the content to the center. 

This means the grid will extend to the parent containers full width, so if you're 
using this on the `<body>`, you should have a grid that stretches to the users full viewport width.

#### Base Configs

| Property     | Type     | Default                      | Description |
| ------------ | -------- | ---------------------------- |-------- |
| columns      | Number   | `6`                          | Maximum amount of columns in the grid. This breaks down responsively |
| gaps         | List     | `0px clamp(16px, 3vw, 32px)` | Vertial gap / horizontal gap - [Grid Gap Value](https://developer.mozilla.org/en-US/docs/Web/CSS/gap) |
| max-width    | Unit     | `1280px`                     | The maximum size of the grids central columns combined
| min-width    | Unit     | `480px`                      | The point in which the grid column breaks down to 1 column. 

#### Base Usage

```css
  $baseConfigs : (
    'columns'      : 6,
    'gaps'         : 0px clamp(16px, 3vw, 32px)
    'max-width'    : 1280px,
    'min-width'    : 480px,
  );

  @forward 'create/grid' with ( $base : $baseConfigs );

  body.grid\:base { 
    @include grid-base() { ... } 
  }
``` 
```html 
  <body class="grid:base"> ... </body>
```

!> Note: If your container children break out of the maximum break point width, 
It's unlilky the base template columns are wrong. You should check the contents of those childen are managed responsivly. 

!> Note: If your configs column count is set to 6 for example, you will end up with a column count of 8.
Keep this in mind should you find yourself repositioning child elements. 

------
## Wrap

Grids that wrap behave similarly to Flexbox wrap. They refer to a `basis` value which 
is used to determine at which point the grid should break down. Essentially this will
adjust the amount of columns in the grid based on the container width. 
For example, if this is a 6 column grid, it may become a 2 or 1 column grid when the
users viewport width is very small. 

**Usage:**

```html 
  <section class="grid:wrap"> ... </section>
```

**Extend:**

```css
  section { 
    @include grid-wrap($basis:300px) { ... }
  }

  /* Output: section.grid\:wrap { ... } */

```



- `grid:base` This is... 
- `grid:wrap` This is... 
- `grid:fixed` This is... 

## Positioning

- `col:1`

- `col:1-span:3`

## Column Count

- `columns:1`
- `columns:2`
- `columns:3`
- `columns:4`...