console.log("Module");

async function start() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await response.json();
  console.log("posts", posts);
}

start();

async function startPromise() {
  return await Promise.resolve("async working");
}

startPromise().then(console.log);
