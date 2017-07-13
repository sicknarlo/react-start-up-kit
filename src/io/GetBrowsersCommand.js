import $ from 'jquery';
import { path } from 'uship';
import Immutable from 'immutable';

function runAsync () {
    return Promise.resolve(
        $.ajax({
            type: 'GET',
            url: path('getBrowsersUrl'),
            dataType: 'json'
        })
    ).then(
        data => Immutable.fromJS(data),
        () => Immutable.fromJS([])
    )
}

export default {
    runAsync
};
