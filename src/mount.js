import ReactDOM from 'react-dom';
import { bootstrap } from 'uship';
import App from './App';
import initializeState from './state';
import withStateAtom from './withStateAtom';

const structure = initializeState(bootstrap.viewData);
const DemoApp = withStateAtom(structure, App);

ReactDOM.render(
    <DemoApp />,
    document.getElementById('mount')
);
