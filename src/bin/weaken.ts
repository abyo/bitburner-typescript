import { NS } from "@ns";

export default async function main(ns: NS): Promise<void> {
  const host: string = <string>ns.args[0];
  await ns.weaken(host);
}
