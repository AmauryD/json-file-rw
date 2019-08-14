const fs = require('fs');
const utils = require('util');
const writeFile = utils.promisify(fs.writeFile);
const readFile = utils.promisify(fs.readFile);
const accessFile = utils.promisify(fs.access);

module.exports = class JsonFileWriter {
    /**
     * @typedef {object} Options
     * @property {number|string} spacing - A String or Number object that's used to insert white space into the output JSON string for readability purposes.
     * @property {function} replacing - A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string.
     */

    /**
     *
     * @param {Options} options
     */
    constructor(options = {spacing : 2,replacing : null}) {
        this.options = options;
        this.jsonContent = {};
        this.fileName = null;
        this.fileExists = false;
    }

    /**
     *
     * @param {string} fileName
     * @return {Promise<void>}
     */
    async open(fileName) {
        this.fileName = fileName;
        await accessFile(fileName,fs.F_OK)
            .catch((err) => {
                this.jsonContent = {};
                this.fileExists = false;
            });
        const content = await readFile(fileName);
        this.jsonContent = JSON.parse(content);
        this.fileExists = true;
    }

    /**
     *
     * @param {string} fileName
     */
    openSync(fileName) {
        this.fileName = fileName;
        try {
            fs.accessSync(fileName,fs.F_OK);
            const content = fs.readFileSync(fileName);
            this.jsonContent = JSON.parse(content);
            this.fileExists = true;
        }catch(err) {
            this.jsonContent = {};
            this.fileExists = false;
        }
    }


    /**
     *
     * @param {string} node
     * @return {boolean}
     */
    nodeExists(node) {
        const nodes = node.split('.');
        const last = nodes.pop();
        let content = this.jsonContent;

        for (const node1 of nodes) {
            content = content[node1];
            if (content === undefined) return false;
        }

        return content[last] !== undefined;
    }

    /**
     *
     * @param {string} node
     * @param {*} defaultValue
     * @return {undefined|*}
     */
    getNodeValue(node,defaultValue = undefined) {
        const nodes = node.split('.');
        const last = nodes.pop();
        let content = this.jsonContent;

        for (const node1 of nodes) {
            content = content[node1];
            if (content === undefined) return defaultValue;
        }

        let exists = content[last] !== undefined;

        if (!exists && defaultValue !== undefined)
            return defaultValue;
        return content[last];
    }

    /**
     *
     * @return {string}
     */
    getFileName() {
        return this.fileName;
    }

    /**
     *
     * @return {boolean}
     */
    getFileExists() {
        return this.fileExists;
    }

    /**
     *
     * @param {string} node
     * @param {*} value
     */
    setNodeValue(node,value) {
        const nodes = node.split('.');
        const last = nodes.pop();
        let content = this.jsonContent;
        for (const node1 of nodes) content = content[node1] === undefined ? content[node1] = {} : content[node1];
        content[last] = value;
    }

    /**
     *
     * @param {object} json
     * @param options
     * @return {*|never|Promise<any>|Promise<void>}
     */
    write(json,options = {}) {
        const optsMerged = { ...this.options , ...options  };
        return writeFile(this.fileName,JSON.stringify(json,optsMerged.replacing,optsMerged.spacing));
    }

    /**
     *
     * @param {object} json
     * @param options
     */
    writeSync(json,options = {}) {
        const optsMerged = { ...this.options , ...options  };
        fs.writeFileSync(this.fileName,JSON.stringify(json,optsMerged.replacing,optsMerged.spacing));
    }

    /**
     *
     * @param {Options} options
     */
    save(options = {}) {
        const optsMerged = { ...this.options , ...options  };
        return writeFile(this.fileName,JSON.stringify(this.jsonContent,optsMerged.replacing,optsMerged.spacing));
    }

    /**
     *
     * @param {Options} options
     */
    saveSync(options = {}) {
        const optsMerged = { ...this.options , ...options  };
        fs.writeFileSync(this.fileName,JSON.stringify(this.jsonContent,optsMerged.replacing,optsMerged.spacing));
    }
};