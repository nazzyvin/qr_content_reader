const dropZone  = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const statusEl  = document.getElementById("status");
const resultEl  = document.getElementById("result");
const typeBadge = document.getElementById("type-badge");
const contentEl = document.getElementById("content");
const detailsEl = document.getElementById("details");
const actionsEl = document.getElementById("actions");

let current = null;

dropZone.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => handleFile(fileInput.files[0]));

["dragover", "dragenter"].forEach((e) =>
    dropZone.addEventListener(e, (ev) => { ev.preventDefault(); dropZone.classList.add("over"); }));

["dragleave", "drop"].forEach((e) =>
    dropZone.addEventListener(e, (ev) => { ev.preventDefault(); dropZone.classList.remove("over"); }));

dropZone.addEventListener("drop", (ev) => handleFile(ev.dataTransfer.files[0]));

function setStatus(message) {
    statusEl.textContent = message;
    statusEl.classList.remove("hidden");
}

async function handleFile(file) {
    if (!file) return;
    setStatus("Decoding...");
    const form = new FormData();
    form.append("file", file);
    try {
        const res = await fetch("/api/decode", {method: "POST", body:form });
        const data = await res.json();
        if (!data.success) {
            setStatus("❌" + (data.error || "Decode failed"));
            resultEl.classList.add("hidden");
            return;
        }
        renderResult(data);
    } catch (err) {
        setStatus("❌" + err.message);
    }
}

function renderResult(data) {
    current = data;
    typeBadge.textContent = data.content_type;
    contentEl.textContent = data.content;
    renderDetails(data.content_type, data.details);
    renderActions(data.actions);
    resultEl.classList.remove("hidden");
    setStatus("✅ Decode " + data.content_type);
}

function renderDetails(type, details) {
    detailsEl.innerHTML = "";
    if (!details) return;
    const labels = {
        ssid: "Network (SSID)", security: "Security", password: "Password", hidden: "Hidden",
        name: "Name", phone: "PHONE", email: "Email", organization: "Organization",
        latitude: "Latitude", longitude: "Longitude",
        address: "Address", subject: "Subject", body: "Body",
        number: "Number", message: "Message"
    };
    const table = document.createElement("table");
    for (const [key, value] of Object.entries(details)) {
        const row = document.createElement("tr");
        const th = document.createElement("th");
        th.textContent = labels[key];
        const td = document.createElement("td");
        td.textContent = value;
        row.appendChild(th); row.appendChild(td);
        table.appendChild(row);
    }
    if (type === "LOCATION" && details.maps_url) {
        const link = document.createElement("a");
        link.href = details.maps_url;
        link.target = "_blank";
        link.textContent = "Open in Google Maps";
        link.classList.add("btn", "action");
        const wrap = document.createElement("p");
        wrap.appendChild(link);
        table.appendChild(wrap);
    }
    if (table.children.length) detailsEl.appendChild(table);
}

function renderActions(actions) {
    actionsEl.innerHTML = "";
    if (!actions) return;
    actions.forEach((name) => {
        const btn = document.createElement("button");
        btn.className = "btn action";
        btn.textContent = name;
        btn.addEventListener("click", () => runAction(name));
        actionsEl.appendChild(btn);
    });
}

async function copy(text, message) {
    try { await navigator.clipboard.writeText(text); setStatus("📋 " + message); }
    catch { setStatus("❌ Clipboard not available."); }
}

function triggerDownload(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setStatus("⬇️ Download started: " + url);
}

function runAction(name) {
    if (!current) return;
    const d = current.details || {};
    const c = current.content;

    if (name === "Open Website" || name === "Open")     { window.open(c, "_blank"); return; }
    if (name === "Send Email")  { window.open(c.startsWith("mailto:") || c.startsWith("MATMSG:") || c.startsWith("matmsg:") ? c : "mailto:" + d.address, "_blank"); return; }
    if (name === "Call Number") { window.open(c, "_blank"); return; }
    if (name === "Send SMS")    { window.open(c, "_blank"); return; }
    if (name === "Open in Maps"){ window.open(d.maps_url, "_blank"); return; }

    if (name === "Download")                 { triggerDownload(c); return; }
    if (name === "Save as .vcf") {
        const blob = new Blob([d.raw_vcard], { type: "text/vcard" });
        const url = URL.createObjectURL(blob);
        triggerDownload(url, (d.name || "contact") + ".vcf");
        return;
    }

    if (name === "Copy Link")       { copy(c, "Link copied."); return; }
    if (name === "Copy Text")       { copy(c, "Text copied."); return; }
    if (name === "Copy Address")    { copy(d.address, "Email copied."); return; }
    if (name === "Copy Number")     { copy(d.number, "Number copied."); return; }
    if (name === "Copy Password")   { copy(d.password, "Password copied."); return; }
    if (name === "Copy Wi-Fi Code") { copy(c, "Wi-Fi code copied."); return; }
    if (name === "Copy Coordinates"){ copy(d.latitude + "," + d.longitude, "Coordinates copied."); return; }
    if (name === "Copy vCard")      { copy(d.raw_vcard, "vCard copied."); return; }

    if (name === "Save Link") {
        const saved = JSON.parse(localStorage.getItem("savedLinks") || "[]");
        saved.push(c);
        localStorage.setItem("savedLinks", JSON.stringify(saved));
        setStatus("💾 Link saved (" + saved.length + " total).");
        return;
    }
}

