const assert = require('assert');
const jsonFileWriter = require('../index');
const fs = require('fs');

describe('Read tests', function() {
    const testFilePath = './test/test.json';

    fs.writeFileSync(testFilePath,JSON.stringify({
        "root":null,
        "deep":{
            "deepChild":[1,2]
        }
    },null,4));

    const fileWriter = new jsonFileWriter();
    fileWriter.openSync(testFilePath);

    it('fileName is correct', function () {
        assert.strictEqual(fileWriter.getFileName(), testFilePath);
    });

    it('file exists', function () {
        assert.strictEqual(fileWriter.getFileExists(), true);
    });

    it('file does not exists', function () {
        const fileWriter = new jsonFileWriter();
        fileWriter.openSync("doesnotexists.cfile");
        assert.strictEqual(fileWriter.getFileExists(), false);
    });

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