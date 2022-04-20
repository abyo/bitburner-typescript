import { NS } from "@ns";

/**
 * The function takes the current server and a set of servers. It then scans the current
 * server for connections, filters out connections that are already in the set, and then adds all new
 * connections to it
 * @param {NS} ns - Netscript API.
 * @param {string} currentServer - the current server you're on
 * @param set - a set of all servers that have been visited
 * @returns an array of all servers names
 */
function getServersList(
  ns: NS,
  currentServer = "home",
  set = new Set<string>()
): string[] {
  let serverConnections: string[] = ns.scan(currentServer);
  // filter connections that aren't in the set
  serverConnections = serverConnections.filter((s) => !set.has(s));
  // add a for each loop to add all new connections to the set
  serverConnections.forEach((server) => {
    set.add(server);
    return getServersList(ns, server, set);
  });

  return Array.from(set.keys());
}

/**
 * Given a hostname, and script RAM usage, return the number of threads that can be ran
 * @param {NS} ns - Netscript API.
 * @param {string} hostname - The hostname of the server you want to run the script on.
 * @param {number} scriptRamUsage - This is the amount of RAM that the script uses
 * @returns The number of threads that can be run on the server.
 */
function getThreadCount(
  ns: NS,
  hostname: string,
  scriptRamUsage: number
): number {
  const usableRam =
    ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);
  return Math.floor(usableRam / scriptRamUsage);
}

export async function main(ns: NS): Promise<void> {
  ns.disableLog("ALL");
  const servers = getServersList(ns);

  for (const server of servers) {
    await ns.scp(
      ["/bin/grow.js", "/bin/weaken.js", "/bin/hack.js"],
      "home",
      server
    );
  }

  while (true) {
    for (const server of servers) {
      if (server === "home") continue;

      if (ns.hasRootAccess(server)) {
        const moneyThreshold = ns.getServerMaxMoney(server) * 0.75;
        const securityThreshold = ns.getServerMinSecurityLevel(server) + 5;
        const canHack =
          ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(server);
        let availableThreads = getThreadCount(ns, server, 1.75);

        if (ns.getServerSecurityLevel(server) > securityThreshold) {
          if (availableThreads > 0 && canHack)
            ns.exec("bin/weaken.js", server, availableThreads, server);
        } else if (ns.getServerMoneyAvailable(server) < moneyThreshold) {
          if (availableThreads > 0 && canHack)
            ns.exec("bin/grow.js", server, availableThreads, server);
        } else {
          availableThreads = getThreadCount(ns, server, 1.7);
          if (availableThreads > 0 && canHack)
            ns.exec("bin/hack.js", server, availableThreads, server);
        }
      } else {
        // try to nuke the server, if it fails, try to open the ports
        try {
          ns.nuke(server);
        } catch (e) {
          e;
        }

        try {
          // don't write this one at the start
          ns.brutessh(server);
          ns.ftpcrack(server);
          ns.relaysmtp(server);
          ns.httpworm(server);
          ns.sqlinject(server);
        } catch (e) {
          e;
        }
      }
      await ns.sleep(1);
    }
  }
}

// serverList: ["n00dles","home","foodnstuff","nectar-net","silver-helix","phantasy","computek","crush-fitness","avmnite-02h","summit-uni","syscore","sigma-cosmetics","CSEC","omega-net","the-hub","rothman-uni","aevum-police","catalyst","rho-construction","global-pharm","unitalife","univ-energy","nova-med","titan-labs","fulcrumtech","kuai-gong","b-and-a","stormtech","vitalife","omnitek","clarkinc","ecorp","fulcrumassets","The-Cave","4sigma","netlink","joesguns","hong-fang-tea","zer0","harakiri-sushi","iron-gym","max-hardware","neo-net","johnson-ortho","zb-institute","lexo-corp","galactic-cyber","aerocorp","I.I.I.I","alpha-ent","millenium-fitness","snap-fitness","omnia","defcomm","solaris","zeus-med","infocomm","microdyne","applied-energetics","helios",".","blade","nwo","powerhouse-fitness","megacorp","zb-def","deltaone","icarus","taiyang-digital","run4theh111z"]
