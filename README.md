# Welfare Support – FAQ Chatbot

A clean, modern FAQ chatbot with a full chat page and a floating embeddable widget.  
**Blue theme. JSON-configured FAQs. GitHub Pages-ready.**

## Live Preview
- Main app: https://apshone1992.github.io/Welfare-Support/
- Widget (embed this):
  ```html
  <script src="https://apshone1992.github.io/Welfare-Support/public/widget.js"></script>
  ```

## Project Structure
```
/public
  chat.css
  chat.js
  widget.js
  /assets/bot-icon.svg
  /config/faqs.json
index.html
README.md
LICENSE
```

## Getting Started (GitHub Pages)
1. Push all files to your repo.
2. In **Settings → Pages**:
   - Source: **Deploy from branch**
   - Branch: **main** (or your default), folder: **/** (root)
3. Wait 1–3 minutes for deployment.  
4. Open: `https://YOUR-USERNAME.github.io/Welfare-Support/`

## Edit FAQs
Update `public/config/faqs.json`. Basic HTML is supported in answers (e.g., `<b>`, `<a>`).

## Embed as a Floating Widget
Add to any webpage:
```html
<script src="https://apshone1992.github.io/Welfare-Support/public/widget.js"></script>
```

## License
MIT — see `LICENSE`.
