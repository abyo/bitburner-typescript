import { NS } from '@ns';
import { ServerInfo } from '/lib/server';
import { getServersInfos, findBestServerToHack } from '/compiler/utilities';

export async function main(ns: NS): Promise<void> {
  ns.disableLog('sleep');
  const serversData = getServersInfos(ns);
  const target: ServerInfo = new ServerInfo(ns, findBestServerToHack(ns));

  for (const server of serversData) {
    await ns.scp(['/bin/grow.js', '/bin/weaken.js', '/bin/hack.js'], 'home', server.hostname);
    await ns.sleep(10);
  }

  const moneyThreshold = target.money.max * 0.75;
  const securityThreshold = target.security.min + 5;

  while (true) {
    for (const server of serversData) {
      if (server.admin && target.admin) {
        let targetMoney = target.money.available;
        if (targetMoney <= 0) targetMoney = 1;

        let weakenThreads = Math.ceil((target.security.level - target.security.min) / ns.weakenAnalyze(1));
        let hackThreads = Math.ceil(ns.hackAnalyzeThreads(target.hostname, targetMoney));
        let growThreads = Math.ceil(ns.growthAnalyze(target.hostname, target.money.max / targetMoney));
        let availableThreads = server.calculateThreadCount(1.75);

        const canHack = ns.getHackingLevel() >= server.hackLevel;

        if (target.security.level > securityThreshold) {
          weakenThreads = Math.min(availableThreads, weakenThreads);
          if (availableThreads > 0 && canHack) ns.exec('bin/weaken.js', server.hostname, weakenThreads, target.hostname);
        } else if (target.money.available < moneyThreshold) {
          growThreads = Math.min(availableThreads, growThreads);
          if (availableThreads > 0 && canHack) ns.exec('bin/grow.js', server.hostname, growThreads, target.hostname);
        } else {
          availableThreads = server.calculateThreadCount(1.70);
          hackThreads = Math.min(availableThreads, hackThreads);
          if (availableThreads > 0 && canHack) ns.exec('bin/hack.js', server.hostname, hackThreads, target.hostname);
        }
      } else {
        server.penetrate();
      }

      await ns.sleep(1);
    }
  }
}
