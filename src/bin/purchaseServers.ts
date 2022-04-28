import { NS } from '@ns';
import { ServerInfo } from '/lib/server';
import { getServersList, generateRandomString } from '/compiler/utilities';

function removeServer(ns: NS, server: string): void {
  ns.deleteServer(server);
}

function buyServer(ns: NS, ram: number): string {
  const serverName = generateRandomString();
  const server = ns.purchaseServer(serverName, 2 ** ram);
  return server;
}

export function main(ns : NS) : void {
  const servers = getServersList(ns);
  const serversData = [];

  for (const server of servers) {
    serversData.push(new ServerInfo(ns, server));
  }

  const serversPurchased = serversData.filter((server) => server.purchased);

  if (ns.args[0] === 2 || ns.args[0] === 3) {
    for (const server of serversPurchased) {
      ns.killall(server.hostname);
      removeServer(ns, server.hostname);
    }
  }

  for (let i = 0; i < 26; i += 1) {
    if (ns.args[0] === 1) {
      buyServer(ns, 6);
    } else if (ns.args[0] === 2) {
      buyServer(ns, 9);
    } else if (ns.args[0] === 3) {
      buyServer(ns, 12);
    } else {
      buyServer(ns, 20);
    }
  }
}
