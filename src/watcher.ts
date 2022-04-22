/* eslint-disable */
import { NS, ProcessInfo } from '@ns';

const getHash = (input: string): number => {
  let hash = 0;
  let i;
  let chr;
  if (input.length === 0) return hash;
  for (i = 0; i < input.length; i++) {
    chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
export async function main(ns: NS): Promise<void> {
  const hashes: Record<string, number> = {};
  const files = ns.ls('home', '.js');

  for (const file of files) {
    const contents = ns.read(file);
    hashes[file] = getHash(contents);
  }

  while (true) {
    for (const file of files) {
      const contents = ns.read(file);
      const hash = getHash(contents);

      if (hash !== hashes[file]) {
        ns.tprintf(`INFO: Detected change in ${file}`);

        const processes = ns.ps().filter((p: ProcessInfo) => p.filename === file);

        for (const process of processes) {
          ns.tprintf(`INFO: Restarting ${process.filename} ${process.args} -t ${process.threads}`);
          if (process.filename !== ns.getScriptName()) {
            ns.kill(process.pid);
            ns.run(process.filename, process.threads, ...process.args);
          } else {
            ns.spawn(process.filename, process.threads, ...process.args);
          }
        }

        hashes[file] = hash;
      }
    }

    await ns.sleep(1000);
  }
}
