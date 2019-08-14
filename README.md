# json-file-rw

Read and write to json file

## Install
```bash
    npm install json-file-rw
```

## Test
```bash
    mocha
```

## Example

```js
    // sync example
    const jsonFileWriter = require('json-file-rw');

    const fileWriter = new jsonFileWriter();
    fileWriter.openSync('file.json');
    fileWriter.setNodeValue("test",123);
    fileWriter.setNodeValue("hello.deep.value","Hey , i'm so deep");
    
    const value = fileWriter.getNodeValue("hello.deep.value");
    console.log(value);
    
    const iDoNotExists = fileWriter.getNodeValue("hello.deep.foo","oops");
    console.log(iDoNotExists);
    
    fileWriter.saveSync();
```

```js
    //async example
    const jsonFileWriter = require('json-file-rw');

    const fileWriter = new jsonFileWriter();
    await fileWriter.open('file.json');
    fileWriter.setNodeValue("test",123);
    fileWriter.setNodeValue("hello.deep.value","Hey , i'm so deep");
    
    const value = fileWriter.getNodeValue("hello.deep.value");
    console.log(value);
    
    const iDoNotExists = fileWriter.getNodeValue("hello.deep.foo","oops");
    console.log(iDoNotExists);
    
    await fileWriter.save();
```
