import { NS } from '@ns';
import { ServerInfo } from '/lib/server';
import { findServer } from '/compiler/utilities';

export function main(ns: NS): void {
  const server = (findServer(ns, ns.getHostname(), <string>ns.args[0], []).pop() as string);
  const {
    hostname, organization, money, security, admin, hackLevel, backdoor, ports,
  } = new ServerInfo(ns, server);

  // Alias: bscan [host]
  ns.tprint(`
Server: ${hostname} (${organization})
Security: ${security.min.toFixed(2)} / ${security.level.toFixed(2)}
Hack skill: ${hackLevel} (root access: ${admin ? 'Y' : 'N'} | backdoor: ${backdoor ? 'Y' : 'N'})
Hack chance: ${(ns.hackAnalyzeChance(hostname) * 100).toFixed(2)}%
Ports required: ${ports.required} / 5 (${ports.open} open)
<<>><<>><<>><<>><<>><<>><<>><<>><<>><<>>
Money: ${ns.nFormat(money.available, '$0.000a')} / ${ns.nFormat(money.max, '$0.000a')} (${((money.available / money.max) * 100).toFixed(2)}%)
Growth: ${ns.getServerGrowth(hostname)}
Grow time: ${ns.tFormat(ns.getGrowTime(hostname))}
Weaken time: ${ns.tFormat(ns.getWeakenTime(hostname))}
Hack time: ${ns.tFormat(ns.getHackTime(hostname))}`);
}
