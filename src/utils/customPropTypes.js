import isFunction from 'lodash/fp/isFunction';
import isElement from 'lodash/fp/isElement';
import augmentWithRequired from './customPropTypesIsRequired';
import elementMatchesComponentType from './elementMatchesComponentType';

const ANONYMOUS = '<<anonymous>>';

function isCursor (props, propName, componentName = ANONYMOUS) {
    const propExists = props.hasOwnProperty(propName);
    const isCursorLike = props[propName] && isFunction(props[propName].cursor);

    if (propExists && !isCursorLike) {
        return new Error(`${propName} for ${componentName} should implement the cursor interface.`);
    }

    return null;
}

function isNonEmptyString (props, propName, componentName = ANONYMOUS) {
    const propExists = props.hasOwnProperty(propName);
    const isString = props[propName] && typeof props[propName] === 'string';
    const hasLength = isString && props[propName].length > 0;

    if (propExists && !(isString && hasLength)) {
        return new Error(`${propName} for ${componentName} must be a non-empty string.`);
    }

    return null;
}

function isComponent (props, propName, componentName = ANONYMOUS) {
    const prop = props[propName];

    if (!prop) return null;
    // Is a composite component (React.Component or React.createClass)
    if (prop.prototype && prop.prototype.isReactComponent) return null;
    // Is (potentially) a stateless functional component
    if (isFunction(prop)) return null;

    return new Error(`${propName} for ${componentName} was expected to be a React Component constructor`);
}

function getComponentName (x)  {
    return x.name || x.displayName || x;
}

function matchesComponentPattern (patterns) {
    return augmentWithRequired(function validatePattern (props, propName, componentName = ANONYMOUS) {
        if (!props[propName]) return null;
        const propValue = props[propName];

        // If any patterns match, the prop is valid. `null` is
        // an early return meaning a matching pattern was found
        for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i];
            let matchesPattern = false;

            if (!Array.isArray(pattern)) {
                matchesPattern = propValue === null || elementMatchesComponentType(propValue, pattern);
            } else {
                matchesPattern = pattern.every((expectedComponent, i) => (
                    propValue[i] === null || elementMatchesComponentType(propValue[i], expectedComponent)
                ));
            }

            if (matchesPattern) return null;
        }

        const formattedPatterns = patterns
            .map(p => Array.isArray(p) ? p.map(getComponentName) : getComponentName(p))
            .map(x => `[${x.toString()}]`)
            .join('\n');

        return new Error(`${propName} for ${componentName} expected React elements to match one of these patterns: ${formattedPatterns}`);
    });
}

function isElementOfType (type) {
    return augmentWithRequired((props, propName, componentName = ANONYMOUS) => {
        if (!props[propName]) return null;
        if (elementMatchesComponentType(props[propName], type)) return null;
        return new Error(`Expected ${propName} for ${componentName} to be a React element of type ${getComponentName(type)}`);
    });
}

function isArrayOfTypes (types) {
    return augmentWithRequired((props, propName, componentName = ANONYMOUS) => {
        if (props[propName].every((child) => types.includes(child.type))) {
            return null;
        }
        const names = types.map((type) => type.displayName ? type.displayName.split('_')[0] : ANONYMOUS);
        return new Error(`Expected ${propName} for ${componentName} to be a React element of types ${names}`);
    });
}

function isHtmlElement (props, propName, componentName = ANONYMOUS) {
    if (!props[propName]) return null;
    const propValue = props[propName];

    if (!isElement(propValue)) {
        return new Error(`${propName} for ${componentName} was expected to be an HTMLElement (a DOM node)`);
    }
    return null;
}

function deprecate (propType, message) {
    let warned = false;
    return (...args) => {
        const [props, propName] = args;
        const prop = props[propName];
        if (prop !== undefined && prop !== null && !warned) {
            warned = true;
            /* eslint no-console: 0 */
            console.warn(message);
        }
        return propType.call(this, ...args);
    };
}

function requiredIf (type, condition) {
    return function (props) {
        const test = condition(props) ? type.isRequired : type;
        return test.apply(this, arguments);
    };
}

const CustomPropTypes = {
    component: augmentWithRequired(isComponent),
    cursor: augmentWithRequired(isCursor),
    componentPattern: matchesComponentPattern,
    htmlElement: augmentWithRequired(isHtmlElement),
    elementOfType: isElementOfType,
    arrayOfTypes: isArrayOfTypes,
    nonEmtpyString: augmentWithRequired(isNonEmptyString),
    deprecate,
    requiredIf
};

export default CustomPropTypes;