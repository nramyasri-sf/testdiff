import {expect, test} from '@oclif/test'
import * as sinon from 'sinon';
import Test from '../../src/commands/deprecation/checkdiff';

const sandbox = sinon.createSandbox();
Test.flags.goldfile.default = 'test/test-command-gold-file.json';



describe('deprecation:checkdiff', () => {

    afterEach(() => {
        sandbox.restore();
    });

    test
    .stdout()
    .command(['deprecation:checkdiff'])
    .it('tests for diff', ctx => {
        expect(ctx.stdout).to.contain('There have been changes in the flags of the following commands  :  help. Please check again.')
        expect(ctx.stdout).to.contain('These commands have been deleted, please check again   : [ { command: \'testCommand\', flags: [] } ]')
    });
});
