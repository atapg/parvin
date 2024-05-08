const mainElement = Parvin.createElement('div', {}, [])

import('./navbar.js').then((NavbarComponent) => {
    mainElement.appendChild(NavbarComponent.default)
})

Parvin.render(mainElement, document.getElementById('app'))
