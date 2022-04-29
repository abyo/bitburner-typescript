import { NS } from '@ns';
import { getServersInfos } from '/compiler/utilities';

export function main(ns : NS) : void {
  const serversData = getServersInfos(ns);

  for (const server of serversData) {
    ns.scriptKill('/bin/weaken.js', server.hostname);
    ns.scriptKill('/bin/grow.js', server.hostname);
    ns.scriptKill('/bin/hack.js', server.hostname);
  }
}
