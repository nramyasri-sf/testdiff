import {expect, test} from '@oclif/test'
import * as fs from 'fs';
import * as sinon from 'sinon';

const sandbox = sinon.createSandbox();
let writeFileStub : any ;

describe('deprecation:generate', () => {

    beforeEach(() => {
        writeFileStub = sandbox.stub(fs, 'writeFileSync');
    })

    afterEach(() => {
        sandbox.restore();
    });
     
    test
    .stdout()
    .command(['deprecation:generate'])
    .it('runs command to generate gold file', ctx => {
      expect(writeFileStub.calledOnce).to.be.true; 
      expect(writeFileStub.calledWith('command-gold-file.json')).to.be.true;
      expect(ctx.stdout).to.contain('File has been saved.')
    });
});
