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
        <button @click="clickHandler">
            <span>Click</span>
        </button>
        <button @click="testAlert">
            <span>Click</span>
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
    onDestroyed: function(){},
    onUpdated: function(){},
    onMounted: function(){
        // console.log("component mounted huraa")
    }, 
    methods: {
        clickHandler: function(){
            console.log("Clicked button")
        },
        testAlert:function(){
            // alert("NICEEEEE")
            this.state.count++
            console.log(this.state.count)
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
