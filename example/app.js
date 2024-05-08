const mainElement = Parvin.createElement('div', {}, [])

// Loading async!
import('./navbar.js').then((NavbarComponent) => {
    mainElement.appendChild(NavbarComponent.default)
})
import('./counter.js').then((CounterComponent) => {
    mainElement.appendChild(CounterComponent.default)
})

Parvin.render(mainElement, document.getElementById('app'))
