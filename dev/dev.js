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
