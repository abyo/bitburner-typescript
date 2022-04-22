import { NS, Server } from '@ns';

export default class BaseServer {
  constructor(public ns: NS, public hostname: string) {
    this.ns = ns;
    this.hostname = hostname;
  }

  get data(): Server { return this.ns.getServer(this.hostname); }

  get ip(): string { return this.data.ip; }
}

export function main(ns: NS): Promise<void> {
  const server = new BaseServer(ns, 'n00dles');
  ns.tprint(typeof server.data);
}
