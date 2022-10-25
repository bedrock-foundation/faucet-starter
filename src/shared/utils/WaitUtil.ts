async function wait(timeoutMs: number, value: any = null): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), timeoutMs);
  });
}

async function forTrue(fn: () => boolean) {
  const count = 0;
  return new Promise((resolve, reject) => {
    if (fn()) {
      resolve(true);
      return;
    }

    const interval = setInterval(() => {
      if (fn()) {
        clearInterval(interval);
        resolve(true);
        return;
      }
      if (count >= 200) reject();
    }, 50);
  });
}

const WaitUtil = {
  wait,
  forTrue,
};

export default WaitUtil;
