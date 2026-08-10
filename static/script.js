/* ============================================================
   Element references
   ============================================================ */

const dropZone        = document.getElementById("drop-zone");
const browseLabel     = document.getElementById("browse-label");
const fileInput       = document.getElementById("file-input");
const statusEl        = document.getElementById("status");
const emptyState      = document.getElementById("empty-state");
const emptyCameraBtn  = document.getElementById("empty-camera");
const emptyBrowseBtn  = document.getElementById("empty-browse");
const resultEl        = document.getElementById("result");
const typeBadge       = document.getElementById("type-badge");
const contentEl       = document.getElementById("content");
const contentCopyBtn  = document.getElementById("content-copy");
const detailsEl       = document.getElementById("details");
const actionsEl       = document.getElementById("actions");
const pasteBtn        = document.getElementById("paste-btn");
const themeToggle     = document.getElementById("theme-toggle");
const cameraBtn       = document.getElementById("camera-btn");
const cameraPanel     = document.getElementById("camera-panel");
const videoEl         = document.getElementById("camera");
const cameraStopBtn   = document.getElementById("camera-stop");
const canvasEl        = document.getElementById("frame-canvas");
const historyPanel    = document.getElementById("history");
const historyList     = document.getElementById("history-list");
const historyFullBtn  = document.getElementById("history-full");
const clearHistoryBtn = document.getElementById("clear-history");
const picker          = document.getElementById("picker");
const pickerTitle     = document.getElementById("picker-title");
const pickerList      = document.getElementById("picker-list");
const decodeAgainBtn  = document.getElementById("decode-again");
const toastsEl        = document.getElementById("toasts");

let current = null;
let cameraStream = null;
let scanTimer = null;
let scanning = false;
let frameInFlight = false;
let showAllHistory = false;
const canvasCtx = canvasEl.getContext("2d");

/* ============================================================
   Type metadata (icon + chip tone)
   ============================================================ */

const TYPE_META = {
  URL:        { icon: "link",      tone: "blue" },
  TEXT:       { icon: "file-text", tone: "slate" },
  EMAIL:      { icon: "mail",      tone: "cyan" },
  PHONE:      { icon: "phone",     tone: "green" },
  SMS:        { icon: "message",   tone: "indigo" },
  WIFI:       { icon: "wifi",      tone: "violet" },
  LOCATION:   { icon: "map-pin",   tone: "rose" },
  CONTACT:    { icon: "user",      tone: "fuchsia" },
  IMAGE:      { icon: "image",     tone: "emerald" },
  AUDIO:      { icon: "music",     tone: "amber" },
  VIDEO:      { icon: "video",     tone: "indigo" },
  PDF:        { icon: "file",      tone: "rose" },
  WORD:       { icon: "file-text", tone: "blue" },
  EXCEL:      { icon: "table",     tone: "green" },
  POWERPOINT: { icon: "sliders",   tone: "orange" },
  ZIP:        { icon: "package",   tone: "slate" },
  RAR:        { icon: "package",   tone: "slate" },
  UNKNOWN:    { icon: "help",      tone: "slate" }
};

const LABELS = {
  ssid: "Network (SSID)", security: "Security", password: "Password", hidden: "Hidden",
  name: "Name", phone: "Phone", email: "Email", organization: "Organization",
  latitude: "Latitude", longitude: "Longitude",
  address: "Address", subject: "Subject", body: "Body",
  number: "Number", message: "Message"
};

const MASKABLE = new Set(["password"]);

/* Shareable content types (never Wi-Fi — avoids leaking passwords) */
const SHAREABLE = new Set(["URL", "TEXT", "EMAIL", "LOCATION"]);

/* ============================================================
   SVG icons
   ============================================================ */

const ICONS = {
  scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 8h2v4H8z"/><path d="M14 8h2v4h-2z"/><path d="M8 14h3v-2"/><path d="M14 14h1v3"/><path d="M8 20v-1"/><path d="M15 8v1"/><path d="M8 19h2"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  "file-text": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m22 7-10 6L2 7"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><path d="M12 20h.01"/>',
  "map-pin": '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  video: '<path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="3"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  table: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/>',
  sliders: '<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/>',
  package: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  camera: '<path d="M4 8h2l2-3h8l2 3h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"/><circle cx="12" cy="13" r="3.5"/>',
  clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="3"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  "eye-off": '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><path d="m1 1 22 22"/>',
  share: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="m16 6-4-4-4 4"/><path d="M12 2v13"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  "external-link": '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>',
  bookmark: '<path d="M19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  refresh: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>'
};

function svg(name, cls) {
  return `<svg class="${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.help}</svg>`;
}

const ACTION_ICONS = {
  "Open Website": "external-link",
  "Open": "external-link",
  "Download": "download",
  "Save as .vcf": "file",
  "Save as TXT": "file-text",
  "Copy Link": "copy",
  "Copy Text": "copy",
  "Copy Address": "copy",
  "Copy Number": "copy",
  "Copy Password": "copy",
  "Copy Wi-Fi Code": "copy",
  "Copy Coordinates": "copy",
  "Copy vCard": "copy",
  "Send Email": "send",
  "Call Number": "phone",
  "Send SMS": "message",
  "Open in Maps": "map-pin",
  "Show Details": "eye",
  "Save Link": "bookmark",
  "Share": "share"
};

function chip(name, tone, label) {
  const el = document.createElement("span");
  el.className = `chip chip--${tone || "slate"}`;
  el.innerHTML = svg(name);
  el.appendChild(document.createTextNode(label || ""));
  return el;
}

/* ============================================================
   Toasts
   ============================================================ */

function toast(message, kind = "info") {
  const el = document.createElement("div");
  el.className = "toast " + kind;
  el.innerHTML = `<span class="toast-dot"></span><span>${message}</span>`;
  toastsEl.appendChild(el);
  setTimeout(() => el.classList.add("show"), 10);
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, 2600);
}

/* ============================================================
   Spinner
   ============================================================ */

function showSpinner(on, message = "Decoding…") {
  statusEl.classList.toggle("loading", on);
  statusEl.innerHTML = on ? `<span class="spinner"></span><span>${message}</span>` : "";
  statusEl.classList.toggle("hidden", !on);
}

/* ============================================================
   Dark mode
   ============================================================ */

function applyTheme() {
  const saved = localStorage.getItem("theme");
  const dark = saved === "dark" || (!saved && window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  themeToggle.innerHTML = svg(dark ? "sun" : "moon");
}

themeToggle.addEventListener("click", () => {
  const dark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  themeToggle.innerHTML = svg(dark ? "sun" : "moon");
});

/* ============================================================
   File input / drag & drop
   ============================================================ */

dropZone.addEventListener("click", () => fileInput.click());
browseLabel.addEventListener("click", (e) => e.stopPropagation());

dropZone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
});

fileInput.addEventListener("change", () => handleFile(fileInput.files[0]));

["dragover", "dragenter"].forEach((e) =>
  dropZone.addEventListener(e, (ev) => { ev.preventDefault(); dropZone.classList.add("over"); }));

["dragleave", "drop"].forEach((e) =>
  dropZone.addEventListener(e, (ev) => { ev.preventDefault(); dropZone.classList.remove("over"); }));

dropZone.addEventListener("drop", (ev) => handleFile(ev.dataTransfer.files[0]));

document.addEventListener("paste", (e) => {
  if (cameraStream) return;
  for (const item of e.clipboardData?.items || []) {
    if (item.type.startsWith("image/")) { handleFile(item.getAsFile()); return; }
  }
});

pasteBtn.addEventListener("click", async () => {
  try {
    const items = await navigator.clipboard.read();
    for (const it of items) {
      const type = it.types.find((t) => t.startsWith("image/"));
      if (type) {
        const blob = await it.getType(type);
        handleFile(new File([blob], "pasted.png", { type }));
        return;
      }
    }
    toast("No image found in clipboard.", "error");
  } catch {
    toast("Clipboard read not available. Try Ctrl+V.", "error");
  }
});

/* ============================================================
   Decode flow
   ============================================================ */

async function handleFile(file) {
  if (!file) return;
  showSpinner(true);
  const form = new FormData();
  form.append("file", file);
  try {
    const res = await fetch("/api/decode", { method: "POST", body: form });
    const data = await res.json();
    showSpinner(false);
    if (!data.success) { toast(data.error || "Decode failed.", "error"); return; }
    handleData(data);
  } catch (err) {
    showSpinner(false);
    toast(err.message, "error");
  }
}

function handleData(data) {
  const results = data.results || [];
  if (results.length === 0) { toast("Nothing decoded.", "error"); return; }

  if (results.length === 1) {
    hidePicker();
  } else {
    showPicker(results);
    toast(`${results.length} codes found — pick one below.`, "info");
  }
  renderResult(results[0]);
  saveHistory(results[0]);
}

function showEmptyState(show) {
  emptyState.classList.toggle("hidden", !show);
  resultEl.classList.toggle("hidden", show);
}

function renderResult(item) {
  current = item;
  const meta = TYPE_META[item.content_type] || TYPE_META.UNKNOWN;
  typeBadge.innerHTML = svg(meta.icon) + " " + item.content_type;
  typeBadge.classList.remove("chip--blue", "chip--violet", "chip--cyan", "chip--green", "chip--amber",
    "chip--rose", "chip--fuchsia", "chip--indigo", "chip--emerald", "chip--orange", "chip--slate");
  typeBadge.classList.add("chip--" + meta.tone);

  contentEl.textContent = item.content;
  renderDetails(item.content_type, item.details);
  renderActions(item.actions);

  showEmptyState(false);
  resultEl.classList.remove("reveal");
  void resultEl.offsetWidth;
  resultEl.classList.add("reveal");
}

function renderDetails(type, details) {
  detailsEl.innerHTML = "";
  if (!details) return;

  for (const [key, value] of Object.entries(details)) {
    if (key === "raw_vcard" || key === "content") continue;
    if (!value) continue;

    const field = document.createElement("div");
    field.className = "field";

    const labelEl = document.createElement("span");
    labelEl.className = "field-label";
    labelEl.textContent = LABELS[key] || key;

    const valueEl = document.createElement("span");
    valueEl.className = "field-value";
    valueEl.title = value;

    const btn = document.createElement("button");
    btn.className = "field-btn";
    btn.setAttribute("aria-label", "Copy " + (LABELS[key] || key));

    field.append(labelEl, valueEl, btn);

    if (MASKABLE.has(key)) {
      valueEl.textContent = "••••••••";
      btn.innerHTML = svg("eye");
      btn.setAttribute("aria-label", "Reveal password");
      btn.addEventListener("click", () => {
        if (valueEl.dataset.revealed === "1") {
          valueEl.textContent = "••••••••";
          btn.innerHTML = svg("eye");
          valueEl.dataset.revealed = "0";
        } else {
          valueEl.textContent = value;
          btn.innerHTML = svg("eye-off");
          valueEl.dataset.revealed = "1";
        }
      });
    } else {
      let display = value;
      if (key === "hidden" && String(value).toLowerCase() === "true") display = "Yes";
      if (key === "hidden" && String(value).toLowerCase() === "false") display = "No";
      valueEl.textContent = display;
      btn.innerHTML = svg("copy");
      btn.addEventListener("click", () => copy(value, `${labelEl.textContent} copied.`));
    }

    detailsEl.appendChild(field);
  }

  if (type === "LOCATION" && details.maps_url) {
    const link = document.createElement("a");
    link.href = details.maps_url;
    link.target = "_blank";
    link.rel = "noopener";
    link.className = "btn btn-ghost small maps-link";
    link.innerHTML = svg("map-pin");
    link.appendChild(document.createTextNode(" Open in Google Maps"));
    detailsEl.appendChild(link);
  }
}

function renderActions(actions) {
  actionsEl.innerHTML = "";
  if (!actions) actions = [];

  const extra = SHAREABLE.has(current.content_type) && navigator.share ? ["Share"] : [];
  [...actions, ...extra].forEach((name) => {
    const btn = document.createElement("button");
    btn.className = "btn action" + (name === "Share" ? " action--share" : "");
    btn.innerHTML = svg(ACTION_ICONS[name] || "chevron");
    btn.appendChild(document.createTextNode(" " + name));
    btn.addEventListener("click", () => runAction(name));
    actionsEl.appendChild(btn);
  });
}

/* ============================================================
   Picker (multi-code)
   ============================================================ */

function showPicker(results) {
  pickerTitle.textContent = `Found ${results.length} codes`;
  pickerList.innerHTML = "";
  results.forEach((item, idx) => {
    const li = document.createElement("li");
    li.className = "picker-item";
    const meta = TYPE_META[item.content_type] || TYPE_META.UNKNOWN;
    li.appendChild(chip(meta.icon, meta.tone, item.content_type));
    const text = document.createElement("span");
    text.className = "item-content";
    text.textContent = `#${idx + 1} · ${item.content}`;
    li.appendChild(text);
    li.insertAdjacentHTML("beforeend", svg("chevron", "history-chevron"));
    li.addEventListener("click", () => { current = item; renderResult(item); });
    pickerList.appendChild(li);
  });
  picker.classList.remove("hidden");
}

function hidePicker() { picker.classList.add("hidden"); }

/* ============================================================
   Actions
   ============================================================ */

async function copy(text, message) {
  try { await navigator.clipboard.writeText(text); toast(message || "Copied.", "success"); }
  catch { toast("Clipboard not available.", "error"); }
}

function triggerDownload(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "";
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  a.remove();
  toast("Download started.", "success");
}

async function shareCurrent() {
  if (!navigator.share) { fallbackShare(); return; }
  const d = current.details || {};
  const c = current.content;
  const type = current.content_type;
  let shareData;
  if (type === "LOCATION" && d.maps_url) {
    shareData = { title: "Location", text: `${d.latitude},${d.longitude}`, url: d.maps_url };
  } else if (type === "URL") {
    shareData = { title: "Shared URL", url: c };
  } else {
    shareData = { title: "QR Content", text: c };
  }
  try {
    await navigator.share(shareData);
  } catch (err) {
    if (err.name !== "AbortError") fallbackShare();
  }
}

function fallbackShare() {
  const c = current ? current.content : "";
  if (c) copy(c, "Content copied — share it anywhere.");
}

function runAction(name) {
  if (!current) return;
  const d = current.details || {};
  const c = current.content;

  if (name === "Open Website" || name === "Open") { window.open(c, "_blank"); return; }
  if (name === "Send Email") { window.open(c.startsWith("mailto:") || c.startsWith("MATMSG:") || c.startsWith("matmsg:") ? c : "mailto:" + d.address, "_blank"); return; }
  if (name === "Call Number") { window.open(c, "_blank"); return; }
  if (name === "Send SMS") { window.open(c, "_blank"); return; }
  if (name === "Open in Maps") { window.open(d.maps_url, "_blank"); return; }
  if (name === "Share") { shareCurrent(); return; }

  if (name === "Download") { triggerDownload(c); return; }
  if (name === "Save as .vcf") {
    const blob = new Blob([d.raw_vcard], { type: "text/vcard" });
    triggerDownload(URL.createObjectURL(blob), (d.name || "contact") + ".vcf");
    return;
  }
  if (name === "Save as TXT") {
    const blob = new Blob([c], { type: "text/plain" });
    triggerDownload(URL.createObjectURL(blob), "qr-content.txt");
    return;
  }

  if (name === "Copy Link") { copy(c, "Link copied."); return; }
  if (name === "Copy Text") { copy(c, "Text copied."); return; }
  if (name === "Copy Address") { copy(d.address, "Email copied."); return; }
  if (name === "Copy Number") { copy(d.number, "Number copied."); return; }
  if (name === "Copy Password") { copy(d.password, "Password copied."); return; }
  if (name === "Copy Wi-Fi Code") { copy(c, "Wi-Fi code copied."); return; }
  if (name === "Copy Coordinates") { copy(d.latitude + "," + d.longitude, "Coordinates copied."); return; }
  if (name === "Copy vCard") { copy(d.raw_vcard ? d.raw_vcard : c, "vCard copied."); return; }

  if (name === "Save Link") {
    const saved = JSON.parse(localStorage.getItem("savedLinks") || "[]");
    saved.push(c);
    localStorage.setItem("savedLinks", JSON.stringify(saved));
    toast(`Link saved (${saved.length} total).`, "success");
  }
}

contentCopyBtn.addEventListener("click", () => {
  if (current) copy(current.content, "Content copied.");
});

/* ============================================================
   History
   ============================================================ */

function saveHistory(item) {
  if (!item) return;
  const safeItem = JSON.parse(JSON.stringify(item));
  if (safeItem.details) {
    delete safeItem.details.password;
    delete safeItem.details.raw_vcard;
  }
  const list = JSON.parse(localStorage.getItem("history") || "[]");
  list.unshift({ ts: Date.now(), type: item.content_type, content: item.content.slice(0, 80), item: safeItem });
  localStorage.setItem("history", JSON.stringify(list.slice(0, 10)));
  renderHistory();
}

function renderHistory() {
  const list = JSON.parse(localStorage.getItem("history") || "[]");
  historyPanel.classList.remove("hidden");
  historyList.innerHTML = "";

  const showAll = showAllHistory;
  if (!list.length) {
    const empty = document.createElement("li");
    empty.className = "history-empty";
    empty.textContent = "No scans yet — your decoded content will appear here.";
    historyList.appendChild(empty);
  } else {
    list.forEach((entry, idx) => {
      const li = document.createElement("li");
      li.className = "history-item" + (!showAll && idx >= 5 ? " hide" : "");

      const meta = TYPE_META[entry.type] || TYPE_META.UNKNOWN;
      li.appendChild(chip(meta.icon, meta.tone, entry.type));

      const body = document.createElement("div");
      body.className = "history-content";

      const headline = document.createElement("div");
      headline.className = "history-headline";
      const text = document.createElement("span");
      text.className = "history-text";
      text.textContent = entry.content;
      headline.appendChild(text);

      const metaTime = document.createElement("span");
      metaTime.className = "history-meta";
      metaTime.textContent = new Date(entry.ts).toLocaleString();

      body.append(headline, metaTime);
      li.appendChild(body);
      li.insertAdjacentHTML("beforeend", svg("chevron", "history-chevron"));

      li.addEventListener("click", () => { hidePicker(); renderResult(entry.item); });
      historyList.appendChild(li);
    });
  }

  clearHistoryBtn.classList.toggle("hidden", !list.length);
  historyFullBtn.classList.toggle("hidden", list.length <= 5);
  historyFullBtn.textContent = showAll ? "Show Recent" : "View Full History";
}

historyFullBtn.addEventListener("click", () => {
  showAllHistory = !showAllHistory;
  renderHistory();
});

clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem("history");
  showAllHistory = false;
  renderHistory();
});

/* ============================================================
   Camera
   ============================================================ */

cameraBtn.addEventListener("click", startCamera);
cameraStopBtn.addEventListener("click", stopCamera);
emptyCameraBtn.addEventListener("click", startCamera);
emptyBrowseBtn.addEventListener("click", () => fileInput.click());

async function startCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    toast("Camera not supported in this browser/context.", "error");
    return;
  }
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false
    });
    videoEl.srcObject = cameraStream;
    videoEl.classList.remove("hidden");
    cameraPanel.classList.remove("hidden");
    cameraBtn.classList.add("hidden");
    await videoEl.play();
    scanning = true;
    scanTimer = setInterval(sendFrame, 400);
    toast("Scanning… hold the code in frame.", "info");
  } catch (err) {
    toast("Camera access denied: " + err.message, "error");
  }
}

function stopCamera() {
  scanning = false;
  frameInFlight = false;
  if (scanTimer) { clearInterval(scanTimer); scanTimer = null; }
  if (cameraStream) { cameraStream.getTracks().forEach((t) => t.stop()); cameraStream = null; }
  videoEl.srcObject = null;
  cameraPanel.classList.add("hidden");
  cameraBtn.classList.remove("hidden");
}

async function sendFrame() {
  if (!scanning || frameInFlight) return;
  if (videoEl.readyState < 2) return;

  canvasEl.width = videoEl.videoWidth;
  canvasEl.height = videoEl.videoHeight;
  canvasCtx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

  const blob = await new Promise((res) => canvasEl.toBlob(res, "image/jpeg", 0.8));
  if (!blob) return;

  frameInFlight = true;
  const form = new FormData();
  form.append("file", blob, "frame.jpg");
  try {
    const res = await fetch("/api/decode", { method: "POST", body: form });
    const data = await res.json();
    if (data.success) { stopCamera(); handleData(data); }
  } catch { /* keep scanning on transient errors */ }
  finally { frameInFlight = false; }
}

/* ============================================================
   Decode Another
   ============================================================ */

decodeAgainBtn.addEventListener("click", () => {
  stopCamera();
  hidePicker();
  showEmptyState(true);
  showSpinner(false);
  current = null;
  fileInput.value = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ============================================================
   Init
   ============================================================ */

applyTheme();
renderHistory();