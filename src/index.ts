import { NS } from '@ns';
import { ServerInfo } from '/lib/server';
import { getServersList } from '/compiler/utilities';

export async function main(ns : NS) : Promise<void> {
  let homeMoney: number;

  ns.run('/scripts/hacknet.js', 1);
  ns.run('/scripts/boostHack.js', 1);

  while (true) {
    homeMoney = ns.getServerMoneyAvailable('home');
    const servers = getServersList(ns);
    const serversData = [];

    for (const server of servers) {
      serversData.push(new ServerInfo(ns, server));
    }

    const serversPurchased = serversData.filter((server) => server.purchased);
    serversPurchased.sort((a, b) => a.logRam - b.logRam);
    const weakestServer = serversPurchased[0];
    ns.tprint(weakestServer);

    if (homeMoney > 1e8 && weakestServer == null) {
      ns.tprint('[+] Buying servers');
      ns.kill('scripts/boostHack.js', 'home');
      ns.run('/scripts/purchaseServers.js', 1, 1);
      ns.run('/scripts/boostHack.js', 1);
    }

    if (homeMoney > 8e8 && (weakestServer.logRam < 8 || serversPurchased.length < 24)) {
      ns.tprint('[+] Upgrading servers to 512GB');
      ns.kill('scripts/boostHack.js', 'home');
      ns.run('/scripts/purchaseServers.js', 1, 2);
      ns.run('/scripts/boostHack.js', 1);
    }

    if (homeMoney > 6e9 && (weakestServer.logRam < 11 || serversPurchased.length < 24)) {
      ns.tprint('[+] Upgrading servers to 4TB');
      ns.kill('scripts/boostHack.js', 'home');
      ns.run('/scripts/purchaseServers.js', 1, 3);
      ns.run('/scripts/getMoney.js', 1);
    }

    await ns.sleep(15000);
  }
}
