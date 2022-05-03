import { NS } from '@ns';

const aliases = `
alias ka=killall
---
alias fac=run scripts/findServer.js CSEC; run scripts/findServer.js avmnite-02h; run scripts/findServer.js I.I.I.I; run scripts/findServer.js run4theh111z; run scripts/findServer.js w0r1d_d43m0n;
---
alias lsl=ls . -l
`;

export function main(ns : NS) : void {
  ns.tprint(aliases);
}
