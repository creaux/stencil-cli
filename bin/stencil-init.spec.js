'use strict';

const Code = require('code');
const Sinon = require('sinon');
const Lab = require('@hapi/lab');
const Fs = require('fs');
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const Inquirer = require('inquirer');
const expect = Code.expect;
const it = lab.it;
const StencilInit = require('../lib/stencil-init');
const JspmAssembler = require('../lib/jspm-assembler');
const ThemeConfig = require('../lib/theme-config');

describe('stencil init', () => {
    let sandbox;
    let consoleErrorStub;
    let JspmAssemblerStub;
    let ThemeConfigStub;
    let inquirerPromptStub;

    lab.beforeEach(() => {
        sandbox = Sinon.createSandbox();

        sandbox.stub(console, 'log');
        consoleErrorStub = sandbox.stub(console, 'error');

        inquirerPromptStub = sandbox.stub(Inquirer, 'prompt');
        inquirerPromptStub.returns({});

        ThemeConfigStub = sandbox.stub(ThemeConfig);
        ThemeConfigStub.getInstance = sandbox.stub().returns({
            getConfig: sandbox.stub().returns({}),
        });
        JspmAssemblerStub = sandbox.stub(JspmAssembler);

        sandbox.stub(Fs, 'writeFileSync');
    });

    lab.afterEach(() => {
        sandbox.restore();
    });

    it('Should call prompt on run and not log errors if the .stencil file is valid', async () => {
        const dotStencilFilePath = './test/_mocks/bin/dotStencilFile.json';

        await StencilInit.run(JspmAssemblerStub, ThemeConfigStub, dotStencilFilePath);

        expect(consoleErrorStub.calledOnce).to.be.false();
        expect(inquirerPromptStub.calledOnce).to.be.true();
    });

    it('Should inform the user if the .stencil file is broken but continue running', async () => {
        const dotStencilFilePath = './test/_mocks/malformedSchema.json';

        await StencilInit.run(JspmAssemblerStub, ThemeConfigStub, dotStencilFilePath);

        expect(consoleErrorStub.calledOnce).to.be.true();
        expect(inquirerPromptStub.calledOnce).to.be.true();
    });
});
