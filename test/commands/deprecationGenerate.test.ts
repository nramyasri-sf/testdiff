// import { expect, test } from '@Salesforce/command/lib/test';
import {expect, test} from '@oclif/test'
import * as fs from 'fs';
import * as sinon from 'sinon';

const sandbox = sinon.createSandbox();
const writeFileStub = sandbox.stub(fs, 'writeFileSync');

describe('deprecation:generate', () => {

    afterEach(() => {
        sandbox.restore()
    });
     
    test
    .stdout()
    .command(['deprecation:generate'])
    .it('runs hello', ctx => {
      expect(writeFileStub.calledOnce).to.be.true; 
      expect(writeFileStub.calledWith('command-gold-file.json')).to.be.true;
      expect(ctx.stdout).to.contain('File has been saved.')
    });
});
