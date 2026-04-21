import { createClient } from "redis";

let client = null;

try {
  client = createClient({
    url: process.env.REDIS_URL
  });

  client.on("error", () => { }); // ❌ spam band

  (async () => {
    try {
      await client.connect();
      console.log("Redis Connected ✅");
    } catch {
      console.log("Redis not available, skipping...");
    }
  })();

} catch (err) {
  console.log("Redis disabled ❌");
}

export default client;