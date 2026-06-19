import { redirect, useLoaderData } from "react-router";

const LANGUAGE_MAP = {
  zh: "zh-CN",
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
  pt: "pt-PT",
};

function normalizeLocale(value) {
  if (!value) return "";
  return value.toLowerCase().replace(/_/g, "-").trim();
}

function languageFromLocale(value) {
  const normalized = normalizeLocale(value);
  if (!normalized) return null;

  if (LANGUAGE_MAP[normalized]) {
    return LANGUAGE_MAP[normalized];
  }

  const base = normalized.split("-")[0];
  return LANGUAGE_MAP[base] ?? null;
}

function localeFromPath(pathname) {
  if (!pathname) return null;
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return languageFromLocale(firstSegment);
}

function detectLanguageCode(request, reqUrl) {
  const localeFromQuery = reqUrl.searchParams.get("locale");
  const languageFromQuery = reqUrl.searchParams.get("language");
  const localeFromHeader = request.headers.get("x-shopify-locale");
  const acceptLanguage = request.headers.get("accept-language");
  const acceptLanguageFirst = acceptLanguage?.split(",")?.[0];
  const referer = request.headers.get("referer");
  let localeFromRefererPath = null;

  if (referer) {
    try {
      localeFromRefererPath = localeFromPath(new URL(referer).pathname);
    } catch {
      localeFromRefererPath = null;
    }
  }

  return (
    languageFromLocale(localeFromQuery) ||
    languageFromLocale(languageFromQuery) ||
    localeFromRefererPath ||
    languageFromLocale(localeFromHeader) ||
    languageFromLocale(acceptLanguageFirst) ||
    "en-US"
  );
}

export async function loader({ request }) {
  const reqUrl = new URL(request.url);
  const language = detectLanguageCode(request, reqUrl);

  const res = await fetch(
    "https://apeu1.fscloud.com.cn/t/hoymilestest/mp/api/customa/new_ChatService/ChatService/GetChatPageUrlExtension",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: {
          sourceKey: "wss",
          language,
        },
      }),
    }
  );

  const data = await res.json();
  const url = data?.Data;

  if (reqUrl.searchParams.get("redirect") === "1") {
    if (!url) {
      throw new Response("Chat URL not available", { status: 502 });
    }
    throw redirect(url);
  }

  if (reqUrl.searchParams.get("json") === "1") {
    return Response.json({ url });
  }

  return {
    url,
  };
}

export default function Chat() {
  const { url } = useLoaderData();

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat URL</h2>
      <p>{url}</p>
    </div>
  );
}