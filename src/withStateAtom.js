/* global process:false */
import React from 'react';
import curry from 'lodash/fp/curry';

function withStateAtom (structure, RootComponent) {
    class App extends React.Component {
        constructor (props, ctx) {
            super(props, ctx);
            this.state = {
                cursor: structure.cursor()
            }
        }

        componentWillMount () {
            this.onSwap = () => {
                this.setState({ cursor: structure.cursor() });
            };

            structure.on('swap', this.onSwap);

            if (process.env.NODE_ENV !== 'production') {
                window.structure = structure;
            }
        }

        componentWillUnmount () {
            structure.off('swap', this.onSwap);
        }

        render () {
            let { children } = this.props;
            children = React.Children.map(children, c => React.cloneElement(c, this.state));
            return <RootComponent {...this.props} {...this.state} children={children} />;
        }
    }

    App.displayName = 'AppRoot';

    return App;
}

export default curry(withStateAtom);
