import component from 'omniscient';
import classNames from 'classnames';
import CustomPropTypes from './utils/customPropTypes';
import GetBrowsersHandler from './handlers/GetBrowsersHandler';
import GetBrowsersCommand from './io/GetBrowsersCommand';

import './_view.scss';

const View = component('View', {
    propTypes: {
        data: CustomPropTypes.cursor
    },

    handleClick () {
        const command = GetBrowsersCommand;
        const handler = GetBrowsersHandler;
        command
            .runAsync()
            .then(imm => handler.getBrowsers(this.props.data, imm));
    }
}, function ({ data }) {
    // const cOptions = data.cursor('options');
    const cSelectedValue = data.cursor('selection');
    const selection = cSelectedValue.deref();
    const cls = classNames(
        { 'view-unchosen': selection == null },
        { 'view-wisely': selection != null && selection !== 'IE' },
        { 'view-poorly': selection != null && selection === 'IE' }
    );

    return (
        <div className="view">
            <div>Your selection:&nbsp;
                <span className={cls}>
                    {selection ?
                        (selection === 'IE' ? 'You have choosen ... poorly' : 'You have choosen wisely') :
                        'You have not yet chosen'
                    }
                </span>
            </div>
        </div>
    );
});

export default View;
