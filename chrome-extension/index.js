class Breakpoints extends HTMLElement {

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  // TODO: https://codepen.io/tylergaw/pen/jObmNNM
  // Read all breakpoints from the document body.

  breakpoints = [
    { name: 'min',          theme : '#F37252' },
    { name: 'small',        theme : '#F07E00' },
    { name: 'small-medium', theme : '#577D56' },
    { name: 'medium',       theme : '#2A465C' },
    { name: 'large',        theme : '#56425E' },
    { name: 'max',          theme : '#944D6D' }
  ]

  css = `
    :host {
      background-color : #202124;
      position         : fixed;
      bottom           : 0; 
      right            : 0; 
      padding          : 4px 8px; 
      font-family      : Arial;
      color            : white; 
      text-align       : center;
      z-index          : 999999;
      pointer-events   : none; 
      font-size        : 12px;
      line-height      : 16px;
      text-align       : center;
      transition       : background-color 0.3s ease-in-out;
    }
  `

  connectedCallback() {

    // Add CSS Styles
    let style = document.createElement('style')
    style.textContent = this.css
    this.shadow.appendChild(style)

    // Add a span element for copy to be added to later  
    this.messageElement = document.createElement('span');
    this.shadow.appendChild(this.messageElement)

    // Add breakpoint values to the breakpoints object 
    for (const breakpoint of this.breakpoints) {
      let value = getComputedStyle(document.documentElement).getPropertyValue(`--breakpoint-${breakpoint.name}`) || false
      if ( value ) {
        breakpoint['value'] = parseInt(value, 10)

        // Asigned a getter method to check wether this breakpoint current;y matches
        Object.defineProperty(breakpoint, 'matches', {
          get: () => { return window.matchMedia(`(max-width: ${breakpoint.value}px)`).matches }
        })
      } 
    }

    // Remove any properties if they don't include a value
    this.breakpoints = this.breakpoints.filter(breakpoint => breakpoint.value)

    // Sort the order from smallest to largest by their value
    this.breakpoints.sort((a, b) => (a.value > b.value) ? 1 : -1)

    // Add 'previous' and 'next' references to each breakpoint
    for (const [i, breakpoint] of this.breakpoints.entries()) {
      breakpoint['previous'] = this.breakpoints[i - 1] || false
      breakpoint['next']     = this.breakpoints[i + 1] || false
    }

    // Bind some event listeners to the window
    window.addEventListener('resize', () => { this.onWindowResize() }, false)
    window.addEventListener('orientationchange', () => { this.onWindowResize() }, false)
    this.onWindowResize()

  }

  // On Window Resises, check all media queries and break the loop on the first match
  onWindowResize() {
    for ( let breakpoint of this.breakpoints) {
      if ( breakpoint.matches || !breakpoint.next ) {
        this.message = breakpoint
        break;
      }
    }
  }

  // Sets the message copy
  set message(breakpoint) {

    let name             = breakpoint.name
    let mediaQuery       = breakpoint.value + 'px'
    let backgroundColour = breakpoint.theme
    let viewport         = `Viewport: ${window.innerWidth}px`
  
    // Kebab to Title Case the breakpoint name
    name = name.replace('-', ' ').split(/ /g).map(name => `${name.substring(0,1).toUpperCase()}${name.substring(1)}`).join("")
   
    if ( !breakpoint.next && !breakpoint.matches ) {
      backgroundColour = '#A51E2C'
      mediaQuery = `${breakpoint.value}px and above`
    } else if ( !breakpoint.previous ) {
      backgroundColour = '#A51E2C'
      mediaQuery = `${breakpoint.value}px and below`
    } else {
      mediaQuery = `Between ${breakpoint.previous.value}px and ${breakpoint.value}px`
    }

    this.style.backgroundColor = backgroundColour
    this.messageElement.textContent = `${viewport} | ${name}: ${mediaQuery}` || viewport
  
  }
}

customElements.define('doggistyle-breakpoints', Breakpoints);

document.body.appendChild(document.createElement('doggistyle-breakpoints'));
