export function entryText(e) {
  if (!e || typeof e !== "object") return "";
  const direct = e.text || e.prompt || e.message;
  if (typeof direct === "string" && direct) return direct;
  const content = e.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((part) => {
      if (typeof part === "string") return part;
      if (part && typeof part === "object") return part.text || part.content || "";
      return "";
    }).filter(Boolean).join("\n");
  }
  if (content && typeof content === "object") return content.text || JSON.stringify(content);
  return typeof e.preview === "string" ? e.preview : "";
}

export function transcriptEntries(out) {
  const payload = out.transcript || out.thread || {};
  const entries = Array.isArray(payload) ? payload : payload.entries || payload.messages || payload.items || [];
  return Array.isArray(entries) ? entries.filter((entry) => entry && typeof entry === "object") : [];
}
