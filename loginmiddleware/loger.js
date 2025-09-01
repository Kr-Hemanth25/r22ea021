async function postJSON(url, payload) {
  // In browser environment, fetch is always available
  // In Node.js environment, we'll use a try-catch approach
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}

async function Log(stack, level, pkg, message) {
  try {
    const payload = { stack, level, package: pkg, message };
    await postJSON("http://20.244.56.144/evaluation-service/logs", payload);
  } catch (e) {
    console.error("Log failed:", e);
  }
}

const Logger = {
  debug: (stack, pkg, msg) => Log(stack, "debug", pkg, msg),
  info: (stack, pkg, msg) => Log(stack, "info", pkg, msg),
  warn: (stack, pkg, msg) => Log(stack, "warn", pkg, msg),
  error: (stack, pkg, msg) => Log(stack, "error", pkg, msg),
  fatal: (stack, pkg, msg) => Log(stack, "fatal", pkg, msg),
};

export { Log, Logger };
