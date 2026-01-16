// Welfare Support – Floating Widget

(function () {
  // Detect base URL from this script src (…/public/widget.js)
  const currentScript = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  const scriptURL = new URL(currentScript.src, window.location.href);
  // Remove trailing /public/widget.js -> leaves repo root URL
  const appBase = scriptURL.href.replace(/\/public\/widget\.js(?:\?.*)?$/, "/");

  // Launcher button
  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", "Open Welfare Support chat");
  btn.style.cssText = `
    position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;
    width: 60px; height: 60px; border-radius: 50%;
    background: #0078ff; color: #fff; border: none; cursor: pointer;
    box-shadow: 0 6px 18px rgba(0,0,0,0.25); font-size: 24px; line-height: 60px;
  `;
  btn.textContent = "💬";
  document.body.appendChild(btn);

  // Iframe popup
  const frame = document.createElement("iframe");
  frame.title = "Welfare Support Chat";
  frame.src = appBase + "index.html";
  frame.style.cssText = `
    position: fixed; bottom: 90px; right: 20px; z-index: 2147483647;
    width: 380px; height: 520px; border: none; border-radius: 14px;
    display: none; background: #fff;
    box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  `;
  document.body.appendChild(frame);

  btn.addEventListener("click", () => {
    frame.style.display = (frame.style.display === "none" || !frame.style.display) ? "block" : "none";
  });
})();
