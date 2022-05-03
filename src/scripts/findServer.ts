import { NS } from '@ns';
import { findServer } from '/compiler/utilities';

export function main(ns : NS) : void {
  ns.tprint(`\nhome; connect ${findServer(ns, ns.getHostname(), <string>ns.args[0], []).slice(1).join('; connect ')}; backdoor;`);
}
