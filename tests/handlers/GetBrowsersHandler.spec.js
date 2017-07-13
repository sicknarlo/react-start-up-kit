import { expect } from 'chai';
import immstruct from 'immstruct';
import { addImmutableAssertions } from '../testutils/assertions';
import GetBrowsersHandler from '../../src/handlers/GetBrowsersHandler';

addImmutableAssertions();

describe('GetBrowsersHandler', () => {
    it('1 - should update the cursor with the passed in data', () => {
        const struct = immstruct({ options: [], selection: 'initial' });
        const data = 'some data';
        const initial = struct.cursor();
        GetBrowsersHandler.getBrowsers(initial, data);

        const result = struct.cursor();
        expect(result).to.not.equal(initial);
        expect(result.get('options')).to.equal(data);
        expect(result.get('selection')).to.be.null;
    });

    it('2 - should update the cursor with the passed in data (immutable)', () => {
        const struct = immstruct({ options: [], selection: 'initial' });
        const data = 'some data';
        const initial = struct.cursor();
        GetBrowsersHandler.getBrowsers(initial, data);

        const result = struct.cursor();
        expect(result).to.not.equal(initial);
        const expected = immstruct({ options: data, selection: null }).cursor();
        expect(result).to.valueEqual(expected);
    });
});
