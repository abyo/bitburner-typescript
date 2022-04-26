import { NS } from '@ns';
import { ServerInfo } from '/lib/server';
import { getServersList, generateRandomString } from '/compiler/utilities';

function removeServer(ns: NS, server: string): void {
  ns.deleteServer(server);
}

async function buyServer(ns: NS, ram: number): Promise<string> {
  const serverName = generateRandomString();
  const server = ns.purchaseServer(serverName, 2 ** ram);
  await ns.scp(['/bin/grow.js', '/bin/weaken.js', '/bin/hack.js'], 'home', server);
  return server;
}

export async function main(ns : NS) : Promise<void> {
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
      await buyServer(ns, 6);
    } else if (ns.args[0] === 2) {
      await buyServer(ns, 9);
    } else {
      await buyServer(ns, 12);
    }
  }
}
