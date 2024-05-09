# Parvin.js

A lightweight, mini, component-based JavaScript framework inspired by Vue.js and React.js.

This project created for educational purpose :)

## Features

• Component-based architecture: Build your UI using reusable components.

• Virtual DOM: Rendering elements via VDOM and Node tree.

• State management: Handling state changing and rerendering components.

• Vue-like syntax (custom syntax and parser)

• Lifecycle methods, watchers for tracking state changes, event binding

## Installation

Clone project

```bash
  git clone https://github.com/atapg/parvin
```

Then run

```bash
  bun run build #or any other package manager
```

Now you can get parvin.js file from /dist/parvin.js and import it in your .html file

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>

    <body>
        <!-- Make sure to have you root element -->
        <div id="app"></div>

        <!-- And import parvin.js file before your app.js -->
        <script src="dist/parvin.js"></script>
        <script src="app.js" type="module"></script>
    </body>
</html>
```

You are all set!

## Documentation

You can access to methods with Parvin object

First let's create out first element and render it

```javascript
const myFirstParvinElement = Parvin.createElement('div', {}, ['Hello World!'])

Parvin.render(myFirstParvinElement, document.getElementById('app'))
```

Now you can see your element!

We can create component by using createComponent function

```javascript
const template = `
<template>
    <div class="card" style="width: 18rem; margin: 5rem auto;">
        <div class="card-body">
            <p class="card-text">My counter</p>
            <p> count: $$counter </p>
            <button type="button" $click="increment" class="btn btn-primary">Increment</button>
            <button type="button" $click="decrement" class="btn btn-danger" style="margin-left:15px;">Decrement</button>
        </div>
    </div>
</template>
<script>
    {
        state: {
            counter: 1
        },
        methods: {
            increment: function(){
                this.state.counter++
            },
            decrement: function(){
                this.state.counter--
            }
        },
        onCreated: function(){
            console.log("component created")
        },
        onDestroyed: function(){
            console.log("component destroyed")
        },
        onUpdated: function(){
            console.log("component updated")
        },
        onMounted: function(){
            console.log("component mounted")
        },
        watchers: {
            counter(oldValue, newValue, property){
                console.log(property,"value changed from ", oldValue, " to ", newValue)
            }
        }
    }
</script>
`

const myComponent = Parvin.createComponent(
    'MyComponentName',
    'div' /* component root element */,
    {
        class: 'container',
        style: 'background-color: #f2f2f2; padding: 20px;',
    },
    template,
)

// Set your component to our element
myFirstParvinElement.appendChild(myComponent)
```

Congrats! you now created your first component!

• All scripts must be declared in an empty object inside script tags and all templates must be in template tags.

• Reactive states must be in state property.

• Watchers' name should be the same as the reactive state name.

• Methods should be declared inside the methods object.

• There are 4 lifecycle methods named: onCreated, onMounted, onUpdated, onDestroyed.

## Todos

• Add css/style support in the component

• Add component syntax support for template

• Add custom file component support

• And many many more...
