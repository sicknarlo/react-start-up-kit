// Chained type checker that will add isRequired to custom PropTypes.
function augmentWithRequired (validate) {
    function required (isRequired, props, propName, componentName = '<<anonymous>>', location) {
        if (!props.hasOwnProperty(propName) && isRequired) {
            return new Error(`Required ${location} \`${propName}\` was not specified in \`${componentName}\``);
        } else {
            return validate(props, propName, componentName, location);
        }
    }
    //for some reason, lodash partial is not applying the arguments properly.
    //TODO: figure out why
    const chained = required.bind(null, false);
    chained.isRequired = required.bind(null, true);
    return chained;
}

export default augmentWithRequired;