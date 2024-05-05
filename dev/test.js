const testElement = Parvin.createElement('div', {}, [
    Parvin.createElement('h1', {}, ['testtt']),
])

const myComponent = Parvin.createComponent(
    'MY Button',
    'div',
    {
        class: 'btn test nice',
    },
    `<template>
    <div>
        test
        <p>Hello World!</p>
        <p> $$count </p>
        <button @click="decrease">
            Decrease
        </button>
        <button @click="increase">
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
        testAlert:function(){
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
