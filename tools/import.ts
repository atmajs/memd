import { File } from 'atma-io'

async function main () {

    const path = `./lib/esm/memd.mjs`;
    const content = await File.readAsync<string>(path);
    const newContent = content.replace("await (_a = name, Promise.resolve().then(() => require(_a)))", "await import(name);")

    await File.writeAsync(path, newContent);

};


main();
