import CustomPropTypes from './utils/customPropTypes';
import View from './View';

const App = ({ cursor }) => {
    return (
        <div>
            <View data={cursor} />
        </div>
    );
};

App.propTypes = {
    cursor: CustomPropTypes.cursor
};

export default App;
