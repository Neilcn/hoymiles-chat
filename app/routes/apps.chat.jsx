export async function loader() {

  const res = await fetch(
    "https://apeu1.fscloud.com.cn/t/hoymilestest/mp/api/customa/new_ChatService/ChatService/GetChatPageUrlExtension",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: {
          sourceKey: "wss",
          language: "en-US"
        }
      })
    }
  );

  const data = await res.json();

  const url = data?.data?.url;

  if (!url) {
    return new Response("No chat URL", { status: 500 });
  }

  return Response.redirect(url, 302);
}

// MUST exist (important for React Router)
export default function App() {
  return null;
}