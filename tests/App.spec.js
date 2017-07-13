import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import immstruct from 'immstruct';
import uship from 'uship';
import App from '../src/App';

describe('An App component', () => {
    it('1 - should render', () => {
        const wrapper = shallow(<App />);

        expect(wrapper).to.exist;
    });

    // 1.1 - render without errors
    beforeEach(() => {
        sinon.stub(uship, 'path').withArgs('dlsSpriteUrl').returns('fail://test-path');
    });

    afterEach(() => {
        uship.path.restore();
    });

    it('2 - should render without any warnings', () => {
        const cursor = immstruct({ }).cursor();
        const wrapper = shallow(<App cursor={cursor} />);

        expect(wrapper).to.exist;
    });

    it('3 - things go bad with mount', () => {
        const cursor = immstruct({ }).cursor();
        const wrapper = mount(<App cursor={cursor} />);

        expect(wrapper).to.exist;
    });
});
