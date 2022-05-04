import { NS } from '@ns';
import { ServerInfo } from '/lib/server';

export async function main(ns: NS): Promise<void> {
  const home = new ServerInfo(ns, 'home');
  const target = new ServerInfo(ns, 'n00dles');

  let growThreads = Math.ceil(ns.growthAnalyze(target.hostname, target.money.max / target.money.available));
  let weakThreads1 = Math.ceil((target.security.level - target.security.min) * 20);
  let weakThreads2 = Math.ceil(growThreads / 12.5);

  while (growThreads > 0 || weakThreads1 > 0 || weakThreads2 > 0) {
    growThreads = Math.ceil(ns.growthAnalyze(target.hostname, target.money.max / target.money.available));
    weakThreads1 = Math.ceil((target.security.level - target.security.min) * 20);
    weakThreads2 = Math.ceil(growThreads / 12.5);

    if (home.calculateThreadCount(1.75) >= (growThreads + weakThreads1 + weakThreads2)) {
      if (weakThreads1 > 0) {
        ns.exec('bin/batch/weaken.js', 'home', weakThreads1, target.hostname);
      }
      if (growThreads > 0) {
        ns.exec('bin/batch/grow.js', 'home', growThreads, target.hostname);
      }
    } else if (weakThreads1 > 0 && home.calculateThreadCount(1.75) > 0) {
      ns.exec('bin/batch/weaken.js', 'home', Math.min(weakThreads1, home.calculateThreadCount(1.75)), target.hostname);
    } else if (growThreads > 0 && home.calculateThreadCount(1.75) > 0) {
      ns.exec('bin/batch/grow.js', 'home', Math.min(growThreads, home.calculateThreadCount(1.75)), target.hostname);
    } else if (weakThreads2 > 0 && home.calculateThreadCount(1.75) > 0) {
      ns.exec('bin/batch/weaken.js', 'home', Math.min(weakThreads2, home.calculateThreadCount(1.75)), target.hostname);
    }

    await ns.sleep(10);
  }

  while (true) {
    const hackPercent = 0.1;
    const hackThreads = Math.floor(ns.hackAnalyzeThreads(target.hostname, target.money.max * hackPercent));
    weakThreads1 = Math.ceil(hackThreads / 25);
    growThreads = Math.ceil(ns.growthAnalyze(target.hostname, target.money.max / (target.money.max * (1 - hackPercent))));
    weakThreads2 = Math.ceil(growThreads / 12.5);

    const hackTime = ns.getHackTime(target.hostname);
    const weakenTime = hackTime * 4;
    const currentTime = performance.now();
    const nextLanding = weakenTime + 3000 + currentTime;

    const proposedBatch = {
      hk: hackThreads,
      wk1: weakThreads1,
      gr: growThreads,
      wk2: weakThreads2,
    };

    let requiredRam = 1.7 * proposedBatch.hk;
    requiredRam += 1.75 * proposedBatch.wk1;
    requiredRam += 1.75 * proposedBatch.gr;
    requiredRam += 1.75 * proposedBatch.wk2;

    const availableRam = home.ram.free;

    if (availableRam > requiredRam) {
      ns.exec('bin/batch/hack.js', 'home', proposedBatch.hk, target.hostname, nextLanding);
      ns.exec('bin/batch/weaken.js', 'home', proposedBatch.wk1, target.hostname, nextLanding + 40);
      ns.exec('bin/batch/grow.js', 'home', proposedBatch.gr, target.hostname, nextLanding + 80);
      ns.exec('bin/batch/weaken.js', 'home', proposedBatch.wk2, target.hostname, nextLanding + 120);
    }

    await ns.sleep(200);
  }
}
