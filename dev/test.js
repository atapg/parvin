const testElement = Parvin.createElement('div', {}, [
    Parvin.createElement('h1', {}, ['testtt']),
    Parvin.createElement('button', {}, ['Click me']),
])

const myComponent = Parvin.createComponent(
    'MY Button',
    'button',
    {
        class: 'btn test nice',
        style: 'background: red;',
    },
    ['Click my component button'],
)

testElement.appendChild(myComponent)

Parvin.render(testElement, document.getElementById('app'))
