const testElement = Parvin.createElement('div', {}, [
    Parvin.createElement('h1', {}, ['testtt']),
])

const myComponent = Parvin.createComponent(
    'MY Button',
    'button',
    {
        class: 'btn test nice',
        style: 'background: blue; padding: 20px; cursor: pointer;',
    },
    `<template>
    <div>
        <p>Hello World!</p>
        <p> $$count </p>
    </div>
</template>

<script>
{
    state: {
        count: 1
    },
    onCreated: function(){
        console.log("component created")
    },
    onDestroyed: function(){},
    onUpdated: function(){},
    onMounted: function(){
        console.log("component mounted huraa")
    },
}
</script>`,
)

testElement.appendChild(myComponent)
myComponent.addEvent('click', () => {
    alert('Hello!')
})

Parvin.render(testElement, document.getElementById('app'))
