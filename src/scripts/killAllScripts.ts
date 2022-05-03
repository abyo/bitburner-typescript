import { NS } from '@ns';
import { getServersInfos } from '/compiler/utilities';

export function main(ns : NS) : void {
  const serversData = getServersInfos(ns);

  for (const server of serversData) {
    ns.scriptKill('/bin/loop/weaken.js', server.hostname);
    ns.scriptKill('/bin/loop/grow.js', server.hostname);
    ns.scriptKill('/bin/loop/hack.js', server.hostname);
  }
}
