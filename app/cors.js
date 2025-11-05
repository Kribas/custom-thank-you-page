export default function withCors(response) {
  // Make a clone of the response to modify headers safely
  const newResponse = new Response(response.body, response);

  newResponse.headers.set("Access-Control-Allow-Origin", "*");
  newResponse.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, OPTIONS",
  );
  newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return newResponse;
}
