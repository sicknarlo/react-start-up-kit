import React from 'react';

function elementMatchesComponentType (element, component) {
    return React.isValidElement(element) && element.type === component;
}

export default elementMatchesComponentType;