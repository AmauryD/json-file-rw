const assert = require('assert');
const jsonFileWriter = require('../index');
const fs = require('fs');

describe('json file writer tests', function() {
    const testFilePath = './src/test';
    
    describe('Writing tests', function() {
        fs.writeFileSync(testFilePath,'{}');
        const fileWriter = new jsonFileWriter(testFilePath);

        it('write value on root', function () {
            fileWriter.setNodeValue("rootValue", "success");
            fileWriter.saveSync();
            const content = JSON.parse(fs.readFileSync(testFilePath, 'utf-8'));
            assert.strictEqual(content.rootValue, "success");
        });

        it('write deep value on un-existing node', function () {
            fileWriter.setNodeValue("deepValueRoot.deepValueChild", true);
            fileWriter.saveSync();
            const content = JSON.parse(fs.readFileSync(testFilePath, 'utf-8'));
            assert.strictEqual(content.deepValueRoot.deepValueChild, true);
        });
    });

    describe('Read tests', function() {
        fs.writeFileSync(testFilePath,JSON.stringify({
            "root":null,
            "deep":{
                "deepChild":[1,2]
            }
        },null,4));

        const fileWriter = new jsonFileWriter(testFilePath);

        it('read value on root', function () {
            const val = fileWriter.getNodeValue("root");
            assert.strictEqual(val, null);
        });

        it('should return default value if not found', function () {
            const val = fileWriter.getNodeValue("something.notExists","default");
            assert.strictEqual(val, "default");
        });

        it('read deep value', function () {
            const val = fileWriter.getNodeValue("deep.deepChild");
            assert.notStrictEqual(val, [1,2]);
        });
    });

    after(function() {
        fs.unlinkSync(testFilePath);
    });
});
