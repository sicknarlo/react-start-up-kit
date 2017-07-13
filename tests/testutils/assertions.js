import { Assertion } from 'chai';
import Immutable from 'immutable';

function addValidationAssertions () {
    Assertion.addMethod('valid', function (validatedProp) {
        const validator = this._obj;
        const errMessages = validator.getIn(['rules', validatedProp, 'messages']).count();
        this.assert(
            errMessages === 0,
            `expected '${validatedProp}' to be valid, but had ${errMessages} errors`,
            `expected '${validatedProp}' to be invalid but had no errors`,
            0,
            errMessages
        );
    });
}

function addImmutableAssertions () {
    Assertion.addMethod('valueEquals', valueEqualityAssertion);
    Assertion.addMethod('valueEqual', valueEqualityAssertion);
}


const print = (obj) => JSON.stringify(obj, null, '  ');

/**
 * Compares two immutable objects by value
 * The immutable objects must have exactly identical properties and values to be considered equal
 * @param  {[type]} objToEqual [description]
 * @return {[type]}            [description]
 */
function valueEqualityAssertion (objToEqual) {
    // Allow the assertion to take a plain JS object
    const expectedObj = (Immutable.Iterable.isIterable(objToEqual))
        ? objToEqual
        : Immutable.fromJS(objToEqual);

    this.assert(
        Immutable.is(expectedObj, this._obj),
        `expected immutable object: \n${print(this._obj)}\n to value equal object: \n${print(expectedObj)}`,
        `expected immutable object: \n${print(this._obj)}\n not to value equal object: \n${print(expectedObj)}`,
        expectedObj,
        this._obj
    );
}

export {
    addValidationAssertions,
    addImmutableAssertions
};
