const mainElement = Parvin.createElement('div', {}, [])

import('./navbar.js').then((NavbarComponent) => {
    mainElement.appendChild(NavbarComponent.default)
})

mainElement.appendChild(Parvin.createElement('p', {}, ['man olum']))

Parvin.render(mainElement, document.getElementById('app'))
