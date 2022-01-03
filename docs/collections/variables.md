# Variables

Expose a range of useful variable declarations relative to the module you are [forwarding](https://sass-lang.com/documentation/at-rules/forward) them to. 

## Usage <!-- {docsify-ignore} -->

```css
@forward "variables";
```
## Eases

All eases will return a cubic-bezier value.

| Name         | Variable       | One Second Example                             |
|--------------|----------------|------------------------------------------------|
| Linear       | `$ease-linear`      |  <div class="ease-example linear"></div>       |
| Ease in                                                                        |
| In           | `$ease-in`          |  <div class="ease-example in"></div>           |
| In Quad      | `$ease-in-quad`     |  <div class="ease-example in-quad"></div>      |
| In Cubic     | `$ease-in-cubic`    |  <div class="ease-example in-cubic"></div>     |
| In Quart     | `$ease-in-quart`    |  <div class="ease-example in-quart"></div>     |
| In Quint     | `$ease-in-quint`    |  <div class="ease-example in-quint"></div>     |
| In Sine      | `$ease-in-sine`     |  <div class="ease-example in-sine"></div>      |
| In Expo      | `$ease-in-expo`     |  <div class="ease-example in-expo"></div>      |
| In Circ      | `$ease-in-circ`     |  <div class="ease-example in-circ"></div>      |
| In Back      | `$ease-in-back`     |  <div class="ease-example in-back"></div>      |
| Ease out                                                                        |
| Out          | `$ease-out`         |  <div class="ease-example out"></div>          |
| Out Quad     | `$ease-out-quad`    |  <div class="ease-example out-quad"></div>     |
| Out Cubic    | `$ease-out-cubic`   |  <div class="ease-example out-cubic"></div>    |
| Out Quart    | `$ease-out-quart`   |  <div class="ease-example out-quart"></div>    |
| Out Quint    | `$ease-out-quint`   |  <div class="ease-example out-quint"></div>    |
| Out Sine     | `$ease-out-sine`    |  <div class="ease-example out-sine"></div>     |
| Out Expo     | `$ease-out-expo`    |  <div class="ease-example out-expo"></div>     |
| Out Circ     | `$ease-out-circ`    |  <div class="ease-example out-circ"></div>     |
| Out Back     | `$ease-out-back`    |  <div class="ease-example out-back"></div>     |
| Ease in and out                                                                |
| In Out       | `$ease-in-out`      |  <div class="ease-example in-out"></div>       |
| In Out Quad  | `$ease-in-out-quad` |  <div class="ease-example in-out-quad"></div>  |
| In Out Cubic | `$ease-in-out-cubic`|  <div class="ease-example in-out-cubic"></div> |
| In Out Quart | `$ease-in-out-quart`|  <div class="ease-example in-out-quart"></div> |
| In Out Quint | `$ease-in-out-quint`|  <div class="ease-example in-out-quint"></div> |
| In Out Sine  | `$ease-in-out-sine` |  <div class="ease-example in-out-sine"></div>  |
| In Out Expo  | `$ease-in-out-expo` |  <div class="ease-example in-out-expo"></div>  |
| In Out Circ  | `$ease-in-out-circ` |  <div class="ease-example in-out-circ"></div>  |
| In Out Back  | `$ease-in-out-back` |  <div class="ease-example in-out-back"></div>  |

> Author: [Jared Hardy - Compass Ceaser Easing](https://github.com/jhardy/compass-ceaser-easing)

## Brand Colours

All brand colours return a hex value. These are likly to change to a more dynamic format in the future, like HSL. 

| Name         | Variable       | Example                                        |
|--------------|----------------|------------------------------------------------|
| Facebook     | `$facebook`    | <div class="colour-example" style="background-color:#4267B2;">#4267B2</div> |
| Twitter      | `$twitter`     | <div class="colour-example" style="background-color:#1da1f2;">#1da1f2</div> |
| Google       | `$google`      | <div class="colour-example" style="background-color:#E34033;">#E34033</div> |
| Youtube      | `$youtube`     | <div class="colour-example" style="background-color:#ff0000;">#ff0000</div> |
| LinkedIn     | `$linkedin`    | <div class="colour-example" style="background-color:#007bb5;">#007bb5</div> |
| Instagram    | `$instagram`   | <div class="colour-example" style="background-color:#c32aa3;">#c32aa3</div> |
| Pinterest    | `$pinterest`   | <div class="colour-example" style="background-color:#bd081c;">#bd081c</div> |
| Daily Motion | `$dailymotion` | <div class="colour-example" style="background-color:#0066DC;">#0066DC</div> |
| Snapchat     | `$snapchat`    | <div class="colour-example light" style="background-color:#fffc00;">#fffc00</div> |
| Flickr       | `$flickr`      | <div class="colour-example" style="background-color:#f40083;">#f40083</div> |
| Vimeo        | `$vimeo`       | <div class="colour-example light" style="background-color:#1ab7ea;">#1ab7ea</div> |
| Tumbler      | `$tumbler`     | <div class="colour-example" style="background-color:#35465d;">#35465d</div> |
| Reddit       | `$reddit`      | <div class="colour-example" style="background-color:#ff4500;">#ff4500</div> |
| WhatsApp     | `$whatsapp`    | <div class="colour-example light" style="background-color:#25d366;">#25d366</div> |
| Skype        | `$skype`       | <div class="colour-example light" style="background-color:#00aff0;">#00aff0</div> |
| Discord      | `$discord`     | <div class="colour-example" style="background-color:#7289da;">#7289da</div> |
| Yello Studio | `$yello`       | <div class="colour-example light" style="background-color:#FFCB08;">#FFCB08</div> |

> Author: [John Lock - Social Media Colors](https://www.lockedownseo.com/social-media-colors/)

You also get `$brand-colours` sass map, which contains all the above colours. So you can loop through them like so:

```css
  @each $name, $colour in $brand-colours {
    .#{$name} { background-color : $colour; }
  }
```

