import { NS } from '@ns';
import { ServerInfo } from '/lib/server';
import { getServersList, generateRandomString } from '/compiler/utilities';

const COST_PER_RAM = 55000;
const MAX_NUMBER_SERVER = 25;

function canBuyServer(ns: NS, ram: number): boolean {
  return ns.getServerMoneyAvailable('home') >= COST_PER_RAM * 2 ** ram;
}

function removeServer(ns: NS, server: string): void {
  ns.deleteServer(server);
}

async function buyServer(ns: NS, ram: number): Promise<string | null> {
  const serverName = generateRandomString();

  if (canBuyServer(ns, ram)) {
    const server = ns.purchaseServer(serverName, 2 ** ram);
    await ns.scp(['/bin/grow.js', '/bin/weaken.js', '/bin/hack.js'], 'home', server);
    return server;
  }

  return null;
}

export async function main(ns : NS) : Promise<void> {
  let servers = getServersList(ns);
  let serversData = [];

  for (const server of servers) {
    serversData.push(new ServerInfo(ns, server));
  }

  let serversPurchased = serversData.filter((server) => server.purchased);

  while (true) {
    if (serversPurchased.length < MAX_NUMBER_SERVER) {
      const serverRam = 6;
      const newServer = await buyServer(ns, serverRam);
      if (newServer) {
        serversData.push(new ServerInfo(ns, newServer));
        serversPurchased = serversData.filter((server) => server.purchased);
      }
    } else {
      serversPurchased.sort((a, b) => a.logRam - b.logRam);
      const serverToRemove = serversPurchased[0];
      if (canBuyServer(ns, 12)) {
        if (serverToRemove.logRam <= 12) {
          removeServer(ns, serverToRemove.hostname);
          await buyServer(ns, 12);
          servers = getServersList(ns);
          serversData = [];

          for (const server of servers) {
            serversData.push(new ServerInfo(ns, server));
          }

          serversPurchased = serversData.filter((server) => server.purchased);
        }
      }
    }

    await ns.sleep(1000);
  }
}
