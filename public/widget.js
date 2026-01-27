// Welfare Support – Floating Widget (stable permissions)
(function () {
  const currentScript =
    document.currentScript ||
    (function () {
      const scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1];
    })();
  if (!currentScript || !currentScript.src) return;

  const scriptURL = new URL(currentScript.src, window.location.href);
  const appBase = scriptURL.href.replace(/\/public\/widget\.js(?:\?.*)?$/, "/");

  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", "Open Welfare Support chat");
  btn.textContent = "💬";
  btn.style.cssText =
    "position:fixed;bottom:20px;right:20px;z-index:2147483647;width:60px;height:60px;border-radius:50%;background:#0078ff;color:#fff;border:none;cursor:pointer;box-shadow:0 10px 25px rgba(0,0,0,0.22);font-size:24px;line-height:60px;";
  document.body.appendChild(btn);

  const frame = document.createElement("iframe");
  frame.title = "Welfare Support Chat";
  frame.src = appBase + "index.html";
  frame.style.cssText =
    "position:fixed;bottom:90px;right:20px;z-index:2147483647;width:380px;height:520px;border:none;border-radius:16px;display:none;background:#fff;box-shadow:0 18px 45px rgba(0,0,0,0.25);opacity:0;transition:opacity .2s ease;overflow:hidden;";

  // allow scripts + allow user navigation/popups (mailto)
  frame.setAttribute(
    "sandbox",
    "allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
  );

  // allow mic + gps inside iframe
  frame.setAttribute("allow", "geolocation; microphone");

  document.body.appendChild(frame);

  function openFrame() {
    frame.style.display = "block";
    requestAnimationFrame(() => (frame.style.opacity = "1"));
  }
  function closeFrame() {
    frame.style.opacity = "0";
    setTimeout(() => (frame.style.display = "none"), 180);
  }
  function isOpen() {
    return frame.style.display === "block";
  }

  btn.addEventListener("click", () => (isOpen() ? closeFrame() : openFrame()));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeFrame());
  document.addEventListener("click", (e) => {
    const clickedLauncher = e.target === btn;
    const clickedFrame = frame.contains(e.target);
    if (!clickedLauncher && !clickedFrame && isOpen()) closeFrame();
  });
})();
