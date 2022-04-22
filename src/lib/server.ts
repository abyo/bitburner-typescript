import { NS, Server } from "@ns";

// {"cpuCores":1,"ftpPortOpen":false,"hasAdminRights":true,"hostname":"n00dles","httpPortOpen":false,"ip":"35.4.3.7","isConnectedTo":false,"maxRam":4,"organizationName":"Noodle Bar","ramUsed":3.4,"smtpPortOpen":false,"sqlPortOpen":false,"sshPortOpen":true,"purchasedByPlayer":false,"backdoorInstalled":false,"baseDifficulty":1,"hackDifficulty":5.775999999999827,"minDifficulty":1,"moneyAvailable":1627836.5667871258,"moneyMax":1750000,"numOpenPortsRequired":0,"openPortCount":1,"requiredHackingSkill":1,"serverGrowth":3000}

export default class BaseServer {
  constructor(public ns: NS, public hostname: string) {
    this.ns = ns;
    this.hostname = hostname;
  }

  get data(): Server { return this.ns.getServer(this.hostname); }
  get ip(): string { return this.data.ip; }
}

export async function main(ns: NS): Promise<void> {
  const server = new BaseServer(ns, "n00dles");
  ns.tprint(typeof server.data);
}
