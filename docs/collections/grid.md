# Grid

## Layout Types 

Grid layout types are an extendable column template ruleset; each type defines a fundamental pattern to be extended on a component level. 

### Base

The base rule is intended for use on a global container (normally the `<body>` element). 
This will take up the users viewport width and set the child items to the center. 

Each child will remain bound to the max break point width.

**Usage:**

```html 
  <body class="grid:base"> 
```

**Extend:**

```css
  body { 
    @include grid(base) { ... }
  }

  /* Output: body.grid\:base { ... } */

```

?> Tip: If your container children break out of the maximum break point width, It's unlilky the base template columns are wrong. You should check the contents of those childen are managed responsivly. 

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