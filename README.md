# further-in-tech
## Haris browser prototype

Run the website and read-only examples from the repository root with Python 3:

```sh
python3 demo/serve.py
```

Open [the local website](http://localhost:4176). Its example gallery works without installing the extension. To try actual warnings, open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, select the `extension` directory. Pin Haris from the Extensions menu, then choose **Scan now** on any open website. The website also includes a downloadable copy of that directory.

- [Mismatch](http://paydesk.localhost:4176/) shows an address discrepancy. Choose **Why?** for the compared hosts and the independent demo billing link.
- [Listed](http://billing.pearl.localhost:4176/) gives a quieter notice for the fictional operator’s billing host.
- [Unverified](http://shop.localhost:4176/) shows how a new merchant is handled. **Show code step** changes the form dynamically.
- **Scan now** checks the current tab on demand. Results distinguish a listed address, a billing mismatch, and an unverified site.
- Choose English or العربية in the toolbar popup to switch alert language. You can also reopen a dismissed notice there. **Leave site** takes the current tab to a blank page.

Chrome resolves the `.localhost` demo names to loopback. The sample pages accept no card or code input. This prototype uses local field and label rules and a fictional operator directory. It does not authenticate merchants, inspect transactions, or block payments. The mobile SMS and call features are separate proposed components.

Presentation screenshots are in `website/assets/chrome-*.png`. Use the alert language selector on the website to see English and right-to-left Arabic captures. The teal hero photograph, transparent metallic artwork and open-source fonts are bundled locally.
