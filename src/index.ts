import { NS } from '@ns';
import { ServerInfo } from '/lib/server';
import { getServersList } from '/compiler/utilities';

export async function main(ns : NS) : Promise<void> {
  let homeMoney: number;

  ns.run('/bin/hacknet.js', 1);
  let target = 'joesguns';

  while (true) {
    ns.kill('/scripts/getMoney.js', 'home', target);
    ns.run('/scripts/getMoney.js', 1, target);

    homeMoney = ns.getServerMoneyAvailable('home');
    const servers = getServersList(ns);
    const serversData = [];

    for (const server of servers) {
      serversData.push(new ServerInfo(ns, server));
    }

    const serversPurchased = serversData.filter((server) => server.purchased);
    serversPurchased.sort((a, b) => a.logRam - b.logRam);
    const weakestServer = serversPurchased[0];

    if (homeMoney > 1e8 && weakestServer == null) {
      ns.tprint('[+] Buying Servers');
      ns.kill('/scripts/getMoney.js', 'home', target);
      target = 'iron-gym';
      ns.run('/bin/purchaseServers.js', 1, 1);
    }

    if (homeMoney > 8e8 && (weakestServer.logRam < 8 || serversPurchased.length < 24)) {
      ns.tprint('[+] Upgrading servers to 512GB');
      ns.kill('/scripts/getMoney.js', 'home', target);
      target = 'netlink';
      ns.run('/bin/purchaseServers.js', 1, 2);
    }

    if (homeMoney > 6e9 && (weakestServer.logRam < 11 || serversPurchased.length < 24)) {
      ns.tprint('[+] Upgrading servers to 4TB');
      ns.kill('/scripts/getMoney.js', 'home', target);
      target = 'zb-def';
      ns.run('/bin/purchaseServers.js', 1, 3);
    }

    await ns.sleep(15000);
  }
}
