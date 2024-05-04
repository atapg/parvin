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
    `<p>Hello!!</p>`,
)

testElement.appendChild(myComponent)
myComponent.addEvent('click', () => {
    alert('Hello!')
})

Parvin.render(testElement, document.getElementById('app'))
