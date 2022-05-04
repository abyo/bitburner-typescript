import { NS } from '@ns';

const runtimeMultiplier = 3.2;

export async function main(ns: NS): Promise<void> {
  const host: string = <string>ns.args[0];
  const batchLand: number = <number>ns.args[1];

  const runtime = runtimeMultiplier * ns.getHackTime(host);

  if (batchLand) {
    const currentTime = performance.now();
    await ns.sleep(batchLand - currentTime - runtime);
  }

  await ns.grow(host);
}
