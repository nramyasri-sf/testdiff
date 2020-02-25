import {expect, test} from '@oclif/test'
import * as sinon from 'sinon';
import Test from '../../src/commands/deprecation/test';

const sandbox = sinon.createSandbox();
Test.flags.goldfile.default = 'test/test-command-gold-file.json';



describe('deprecation:test', () => {

    afterEach(() => {
        sandbox.restore();
    });

    test
    .stdout()
    .command(['deprecation:test'])
    .it('tests for diff', ctx => {
        expect(ctx.stdout).to.contain('There have been changes in the flags of the following commands  :  help. Please check again.')
    });
});
