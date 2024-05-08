import parvinConfig from '../configs/general'

export const getDomElementsAttributes = (
    domElement: HTMLElement,
): Record<string, any> => {
    // @ts-ignore
    const attributeNodeArray = [...domElement.attributes]
    const attrs = attributeNodeArray.reduce((attrs, attribute) => {
        if (!attribute.name.startsWith(parvinConfig.templateEventSyntax)) {
            attrs[attribute.name] = attribute.value
        }
        return attrs
    }, {})

    return attrs
}
