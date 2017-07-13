import { expect, use } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { shallow } from 'enzyme';
import immstruct from 'immstruct';
import PrimaryButton from '@uship/dls/lib/components/buttons/PrimaryButton';
import DropdownField from '@uship/dls/lib/components/forms/DropdownField';
import View from '../src/View';
import GetBrowsersHandler from '../src/handlers/GetBrowsersHandler';
import GetBrowsersCommand from '../src/io/GetBrowsersCommand';

use(sinonChai);
use(chaiEnzyme());

describe('A View component', () => {
    it('1 - should render', () => {
        const cursor = immstruct({ }).cursor();
        const wrapper = shallow(<View data={cursor} />);

        expect(wrapper).to.exist;
    });

    it('2 - should render with more assertions', () => {
        const cursor = immstruct({ }).cursor();
        const wrapper = shallow(<View data={cursor} />);

        expect(wrapper).to.exist;
        expect(wrapper).to.have.className('view');
        expect(wrapper).to.have.exactly(1).descendants(PrimaryButton);
        expect(wrapper).to.have.exactly(1).descendants(DropdownField);
        expect(wrapper).to.have.exactly(1).descendants('div span.view-unchosen');
        // equivalent to previous assertion
        expect(wrapper.find('div').children('span').first()).to.have.className('view-unchosen');
        // equivalent to previous assertion
        expect(wrapper.find('div span').first()).to.have.className('view-unchosen');
        // almost equivalent to previous assertion: find returns a list
        expect(wrapper.find('div span')).to.have.className('view-unchosen');
    });

    it('3 - should render a wise choice', () => {
        const cursor = immstruct({ selection: 'anything that is not IE' }).cursor();
        const wrapper = shallow(<View data={cursor} />);

        expect(wrapper).to.exist;
        expect(wrapper.find('div span')).to.have.className('view-wisely');
    });

    it('4 - should render a poor choice', () => {
        const cursor = immstruct({ selection: 'IE' }).cursor();
        const wrapper = shallow(<View data={cursor} />);

        expect(wrapper).to.exist;
        expect(wrapper.find('div span')).to.not.have.className('view-wisely');
        expect(wrapper.find('div span')).to.have.className('view-poorly');
    });

    it.skip('5 - should do something when the button is clicked', () => {
        const cursor = immstruct({ }).cursor();
        const wrapper = shallow(<View data={cursor} />);

        wrapper.find(PrimaryButton).simulate('click');
    });

    // 6 stub out command
    let cmdStub, hndlrStub;
    beforeEach(() => {
        cmdStub = sinon.stub(GetBrowsersCommand, 'runAsync');
        hndlrStub = sinon.stub(GetBrowsersHandler, 'getBrowsers');
    });

    afterEach(() => {
        GetBrowsersHandler.getBrowsers.restore();
        GetBrowsersCommand.runAsync.restore();
    });

    it.skip('6 - should do something when the button is clicked', () => {
        const commandPromise = Promise.resolve();
        cmdStub.returns(commandPromise);
        const cursor = immstruct({ }).cursor();
        const wrapper = shallow(<View data={cursor} />);

        wrapper.find(PrimaryButton).simulate('click');

        return commandPromise.then(() => {
            // but what should we assert here?
        });
    });

    it('7 - should execute GetBrowsersHandler when the button is clicked', () => {
        const data = 'some data';
        const commandPromise = Promise.resolve(data);
        cmdStub.returns(commandPromise);
        const cursor = immstruct({ }).cursor();
        const wrapper = shallow(<View data={cursor} />);

        wrapper.find(PrimaryButton).simulate('click');

        return commandPromise.then(() => {
            expect(hndlrStub).to.have.been.called;
            expect(hndlrStub).to.have.been.calledOnce;
            expect(hndlrStub).to.have.been.calledWith(cursor, data);
            expect(hndlrStub).to.have.been.calledWithExactly(cursor, data);
        });
    });
});
