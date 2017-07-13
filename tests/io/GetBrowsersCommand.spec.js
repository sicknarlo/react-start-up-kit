import { expect } from 'chai';
import sinon from 'sinon';
import uship from 'uship';
import $ from 'jquery';
import { addImmutableAssertions } from '../testutils/assertions';
import GetBrowsersCommand from '../../src/io/GetBrowsersCommand';

addImmutableAssertions();

describe('GetBrowsersCommand', () => {
    let ajaxStub;
    beforeEach(() => {
        sinon.stub(uship, 'path').withArgs('getBrowsersUrl').returns('fail://test-path');
        ajaxStub = sinon.stub($, 'ajax');
    });

    afterEach(() => {
        $.ajax.restore();
        uship.path.restore();
    });

    it('1 - returns data when successful', () => {
        const data = [ 'test', 'please', 'ignore' ];
        ajaxStub.returns(Promise.resolve(data));

        return GetBrowsersCommand.runAsync().then(imm => {
            expect(imm).to.valueEqual(data);
        });
    });

    it('2 - returns data when unsuccessful', () => {
        ajaxStub.returns(Promise.reject('something went wrong!'));

        return GetBrowsersCommand.runAsync().then(imm => {
            expect(imm).to.valueEqual([]);
        });
    });
});
