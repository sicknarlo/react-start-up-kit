import immstruct from 'immstruct';
import cloneDeep from 'lodash/fp/cloneDeep';

function initializeState (viewData) {
    const data = cloneDeep(viewData);
    const state = {
        options: data.unitTesting.options || [],
        selection: data.unitTesting.selection
    };

    return immstruct(state);
}

export default initializeState;
