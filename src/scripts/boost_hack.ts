import { NS } from '@ns';
import { getServersInfos } from '/compiler/utilities';

export async function main(ns: NS): Promise<void> {
  ns.disableLog('sleep');
  const serversData = getServersInfos(ns);

  for (const server of serversData) {
    await ns.scp(['/bin/loop/grow.js', '/bin/loop/weaken.js', '/bin/loop/hack.js'], 'home', server.hostname);
    await ns.sleep(10);
  }

  while (true) {
    for (const server of serversData) {
      if (server.admin) {
        const moneyThreshold = server.money.max * 0.75;
        const securityThreshold = server.security.min + 5;
        const canHack = ns.getHackingLevel() >= server.hackLevel;
        let availableThreads = server.calculateThreadCount(1.75);

        if (server.security.level > securityThreshold) {
          if (availableThreads > 0 && canHack) ns.exec('bin/loop/weaken.js', server.hostname, availableThreads, server.hostname);
        } else if (server.money.available < moneyThreshold) {
          if (availableThreads > 0 && canHack) ns.exec('bin/loop/grow.js', server.hostname, availableThreads, server.hostname);
        } else {
          availableThreads = server.calculateThreadCount(1.7);
          if (availableThreads > 0 && canHack) ns.exec('bin/loop/hack.js', server.hostname, availableThreads, server.hostname);
        }
      } else {
        server.penetrate();
      }
      await ns.sleep(1);
    }
  }
}
