const assert = require('assert');
const jsonFileWriter = require('../index');
const fs = require('fs');

describe('Write tests', function() {
    const testFilePath = './test/test.json';
    fs.writeFileSync(testFilePath,'{}');

    describe('sync tests',function () {
        const fileWriter = new jsonFileWriter();
        fileWriter.openSync(testFilePath);

        it('write value on root sync', function () {
            fileWriter.setNodeValue("rootValue", "success");
            fileWriter.saveSync();
            const content = JSON.parse(fs.readFileSync(testFilePath, 'utf-8'));
            assert.strictEqual(content.rootValue, "success");
        });

        it('write deep value on un-existing node sync', function () {
            fileWriter.setNodeValue("deepValueRoot.deepValueChild", true);
            fileWriter.saveSync();
            const content = JSON.parse(fs.readFileSync(testFilePath, 'utf-8'));
            assert.strictEqual(content.deepValueRoot.deepValueChild, true);
        });

        it('write json sync', function () {
            fileWriter.writeSync({a : 4});
            const content = JSON.parse(fs.readFileSync(testFilePath, 'utf-8'));
            assert.strictEqual(content.a, 4);
        });
    });

    describe('async tests',function () {
        const fileWriter = new jsonFileWriter();

        it('write deep value on un-existing node async', function (done) {
            fileWriter.open(testFilePath).then(() => {
                fileWriter.setNodeValue("deepValueRoot.deepValueChildAsync", 42);
                fileWriter.save().then(() => {
                    const content = JSON.parse(fs.readFileSync(testFilePath, 'utf-8'));
                    assert.strictEqual(content.deepValueRoot.deepValueChildAsync, 42);
                    done();
                });
            });
        });

        it('write json async', function (done) {
            fileWriter.open(testFilePath).then(() => {
                fileWriter.write({a: 3}).then(() => {
                    const content = JSON.parse(fs.readFileSync(testFilePath, 'utf-8'));
                    assert.strictEqual(content.a, 3);
                    done();
                });
            });
        });
    });
});
