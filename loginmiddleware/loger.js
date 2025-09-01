async function postJSON(url, payload) {
const isNode = typeof window === 'undefined';
let fetchFn = typeof fetch === 'function' ? fetch : null;


if (!fetchFn && isNode) {
fetchFn = (await import('node-fetch')).default;
}


const res = await fetchFn(url, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload),
});
return res;
}


export async function Log(stack, level, pkg, message) {
try {
const payload = { stack, level, package: pkg, message };
await postJSON('http://20.244.56.144/evaluation-service/logs', payload);
} catch (e) {
}
}


export const Logger = {
debug: (stack, pkg, msg) => Log(stack, 'debug', pkg, msg),
info: (stack, pkg, msg) => Log(stack, 'info', pkg, msg),
warn: (stack, pkg, msg) => Log(stack, 'warn', pkg, msg),
error: (stack, pkg, msg) => Log(stack, 'error', pkg, msg),
fatal: (stack, pkg, msg) => Log(stack, 'fatal', pkg, msg),
};