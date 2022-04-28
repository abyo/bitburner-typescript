import { NS } from '@ns';
import { ServerInfo } from '/lib/server';
import { getServersList } from '/compiler/utilities';

export async function main(ns: NS): Promise<void> {
  ns.disableLog('sleep');
  const servers = getServersList(ns);
  const serversData = [];
  const target: ServerInfo = new ServerInfo(ns, <string>ns.args[0]);

  for (const server of servers) {
    serversData.push(new ServerInfo(ns, server));
  }

  for (const server of serversData) {
    await ns.scp(['/bin/grow.js', '/bin/weaken.js', '/bin/hack.js'], 'home', server.hostname);
    await ns.sleep(10);
  }

  while (true) {
    for (const server of serversData) {
      if (server.admin && target.admin) {
        const moneyThreshold = target.money.max * 0.75;
        const securityThreshold = target.security.min + 5;
        const canHack = ns.getHackingLevel() >= server.hackLevel;
        let availableThreads = server.calculateThreadCount(1.75);

        if (target.security.level > securityThreshold) {
          if (availableThreads > 0 && canHack) ns.exec('bin/weaken.js', server.hostname, availableThreads, target.hostname);
        } else if (target.money.available < moneyThreshold) {
          if (availableThreads > 0 && canHack) ns.exec('bin/grow.js', server.hostname, availableThreads, target.hostname);
        } else {
          availableThreads = server.calculateThreadCount(1.7);
          if (availableThreads > 0 && canHack) ns.exec('bin/hack.js', server.hostname, availableThreads, target.hostname);
        }
      } else {
        server.penetrate();
      }
      await ns.sleep(1);
    }
  }
}
