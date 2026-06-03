export function markdownToHtml(markdown: string) {
  const escaped = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const lines = escaped.split(/\r?\n/);
  const html: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (line.startsWith("### ")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<h3>${line.slice(4)}</h3>`);
    } else if (line.startsWith("## ")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<h2>${line.slice(3)}</h2>`);
    } else if (line.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${line.slice(2)}</li>`);
    } else if (line.trim() === "") {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
    } else {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<p>${line}</p>`);
    }
  }

  if (inList) {
    html.push("</ul>");
  }

  return html.join("\n");
}

export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}
