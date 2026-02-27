export async function confirm(prompt: string): Promise<boolean> {
  if (!process.stdin.isTTY) {
    return false;
  }

  process.stdout.write(`${prompt} [y/N]: `);

  return await new Promise<boolean>((resolve) => {
    const onData = (data: Buffer) => {
      const text = data.toString("utf8").trim().toLowerCase();
      process.stdin.off("data", onData);
      resolve(text === "y" || text === "yes");
    };

    process.stdin.on("data", onData);
  });
}
