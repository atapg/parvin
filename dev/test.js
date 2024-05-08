const testElement = Parvin.createElement('div', {}, [
    Parvin.createElement('h1', {}, ['testtt']),
])

const myComponent = Parvin.createComponent(
    'MyComponent',
    'div',
    {},
    `
<template>
    <div class="center"  test="test">
        test
        <p>Hello World!</p>
        <p> $$count </p>
        <button $click="decrease">
            Decrease
        </button>
        <button $click="increase">
            Increase
        </button>
        <div>
            <p>
                test   nested   
                <span>Another one</span>    
            </p>
        </div>
    </div>
</template>

<script>
{
    state: {
        count: 1
    },
    onCreated: function(){
        // console.log("component created")
    },
    onDestroyed: function(){
        // console.log("component destroyed")
    },
    onUpdated: function(){
        // console.log("component updated")
    },
    onMounted: function(){
        // console.log("component mounted")
    }, 
    methods: {
        increase: function(type){
            this.state.count++
        },
        decrease: function(type){
            this.state.count--
        },
        testAlert: function(){
            // alert("NICEEEEE")
            this.state.count++
            console.log(this.state.count)
        }
    },
    watchers:{
        count: function(oldValue, newValue, property){
            console.log(property,"value changed from ", oldValue, " to ", newValue)
        }
    }
}
</script>`,
)

testElement.appendChild(myComponent)
// myComponent.addEvent('click', () => {
//     alert('Hello!')
// })

Parvin.render(testElement, document.getElementById('app'))

const template = `
<test>
    <my-custom> custom </my-custom>
    <my-custom />
    <MyCustom> custom 1 </MyCustom>
    <MyCustom />
</test>
`

const parser = new DOMParser()
const doc = parser.parseFromString(template, 'text/html')
const rootElement = doc.body.firstChild
// console.log(rootElement.tagName.toLowerCase())
