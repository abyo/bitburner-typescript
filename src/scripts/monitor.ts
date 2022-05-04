import { NS } from '@ns';
import { ServerInfo } from '/lib/server';

export async function main(ns: NS): Promise<void> {
  ns.tail();
  ns.disableLog('ALL');

  while (true) {
    const server = new ServerInfo(ns, <string>ns.args[0]);

    let money = server.money.available;
    if (money === 0) money = 1;

    const maxMoney = server.money.max;
    const minSec = server.security.min;
    const sec = server.security.level;

    ns.clearLog();

    ns.print(`${server.hostname}:`);
    ns.print(` $_______: ${ns.nFormat(money, '$0.000a')} / ${ns.nFormat(maxMoney, '$0.000a')} (${((money / maxMoney) * 100).toFixed(2)}%)`);
    ns.print(` security: +${(sec - minSec).toFixed(2)}`);
    ns.print(` hack____: ${ns.tFormat(ns.getHackTime(server.hostname))} (t=${Math.ceil(ns.hackAnalyzeThreads(server.hostname, money))})`);
    ns.print(` grow____: ${ns.tFormat(ns.getGrowTime(server.hostname))} (t=${Math.ceil(ns.growthAnalyze(server.hostname, maxMoney / money))})`);
    ns.print(` weaken__: ${ns.tFormat(ns.getWeakenTime(server.hostname))} (t=${Math.ceil((sec - minSec) * 20)})`);
    await ns.sleep(3000);
  }
}
