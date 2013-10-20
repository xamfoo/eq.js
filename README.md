# eq.js
### Element queries, fast and light

Element queries are the "holy grail" of responsive web design, allowing you to create a single component that can be dropped into any position in any layout and have them respond appropriately. Unfortunately, due to some hard-to-deal-with chicken-and-egg cases, especially involving inline elements, it's unlikely that element queries will make it into browsers any time soon.

**eq.js** aims to be a relatively easy to use drop-in solution to JavaScript powered element queries. Weighing in at less than 1Kb and requiring no external dependencies, **eq.js** sets itself apart through size, speed, and ease of use. Simply drop **eq.js** on to your site and set the `eq-pts` attribute to your element and you're ready to go!

## Installation

## Usage

In order to use **eq.js**, you need to both include `eq.js` on your site and set up the `eq-pts` attribute on your desired element. `eq-pts` needs to be in JSON format, with the key being the human-readable name of the applied state and the value being the `min-width` pixel width of the element you would like to set the state at.

```html
<div class='component' eq-pts='{"small": 400, "medium": 600, "large": 900}'>
  <h1>Hello World</h1>
</div>
```

### IT IS VERY IMPORTANT THAT THE JSON IN `eq-pts` IS FORMATTED CORRECTLY OR `eq.js` WILL NOT TRIGGER.

**`eq-pts` attribute value *must* be wrapped in single quotes and include the curly brace. Keys *must* be wrapped in double quotes. Values *must not* be wrapped in quotes. States need to go from smallest to largest in value**

When **eq.js** has determined which state your element is in, it will add an `eq-state` attribute to the element set to the human-readable name of the `min-width` specified. If the element is smaller than the smallest state, there will be no `eq-state` attribute.

From there, proceed with styling as normal! Because **eq.js** uses attributes, you're going to want to select using attribute selectors. Styling follows the same patters as normal `min-width` media query styling, with styling for the base first, then subsequent styling added on top:

#### Sass

```scss
.container {
	border: 2px solid red;
	background-color: rgba(red, .25);
	
	&[data-state="small"] {
	  border-color: green;
	  background-color: rgba(green .25);
	}
	
	&[data-state="medium"] {
	  border-color: blue;
	  background-color: rgba(orange, .25);
	}
	
	&[data-state="large"] {
	  border-color: blue;
	  background-color: rgba(blue, .25);
	}
}
```

#### CSS

```css
.container {
  border: 2px solid red;
  background-color: rgba(255, 0, 0, 0.25);
}
.container[eq-state="small"] {
  border-color: green;
  background-color: rgba(0, 128, 0, 0.25);
}
.container[eq-state="medium"] {
  border-color: orange;
  background-color: rgba(255, 165, 0, 0.25);
}
.container[eq-state="large"] {
  border-color: blue;
  background-color: rgba(0, 0, 255, 0.25);
}
```

## Todo

* Sort states based on value size to eliminate the need for manual sort.
* Detect for addition or removal of DOM elements to determine available elements.
* Provide Sass mixins and CSS API to reduce what needs to be controlled in HTML (maybe)

## Technical Mumbo Jumbo

**eq.js** has been tested in all modern browsers with thousands of nodes all requesting element queries. The limiting factor performance wise is JavaScript's native `offsetWidth` calculation, which is required for each element; hey, it's an element query after all!

The process for determining which state to apply is primarily greedy for no state, then greedy for the largest state. If the element is neither smaller than its smallest state nor larger than its largest state, it then traverses each state to determine which state is correct. It does this by comparing one state to the next state up, ensuring that the current state is both greater than or equal to the defined `min-width` value and less than the next state's `min-width`.

Performance wise, the script handles itself very well even with thousands of nodes. Unfortunately, it is hard to place an exact number on performance as performance plunges into oblivion with Chrome's profiling tool open.

Be careful what changes you choose to make with this new found power. While element queries are great in theory, they can cause lots of heartache, especially when combined with inline elements. This script very consciously does not and will not attempt to recalculate element queries on all DOM changes as that is very likely to result in a never-ending rabbit hole of craziness. This, IMO, is one of the biggest things holding back element queries being implemented natively.

### tl;dr

`offsetWidth` is slow, **eq.js** is greedy for natural then largest states, with great power comes great responsibility.