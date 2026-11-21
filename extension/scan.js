// Self-contained because Chrome serializes this function when Scan now is pressed.
function inspectCheckout(includeFrames = false) {
  const cardText = /\b(card number|debit card|credit card|pay now|pay bill|proceed to (?:payment|checkout)|payment details|cardholder name|cvv|cvc)\b|رقم البطاقة|ادفع الآن|بيانات الدفع/i;
  const codeText = /\b(otp|one[- ]time (?:pass(?:word|code)|code)|verification code|authentication code)\b|رمز التحقق|رمز التأكيد/i;
  const visible = el => el.getClientRects().length > 0 && el.ownerDocument.defaultView.getComputedStyle(el).visibility !== "hidden";
  const selectors = "input:not([type=hidden]),label,button,a,[role=button],h1,h2,h3,legend";
  function readDocument(doc) {
    let payment = false, code = false;
    for (const el of doc.querySelectorAll(selectors)) {
      if (!visible(el)) continue;
      const metadata = ["autocomplete","aria-label","placeholder","name"].map(key => el.getAttribute(key) || "").join(" ");
      // Read field descriptors only. Never read input values or editable text.
      const isControl = el.matches("input") || el.isContentEditable;
      const caption = isControl || el.querySelector('[contenteditable], textarea') ? "" : (el.textContent || "").slice(0,300);
      const namedCode = codeText.test(metadata + " " + caption) || /\bone-time-code\b/i.test(metadata);
      code ||= namedCode;
      payment ||= cardText.test(metadata + " " + caption) || /\bcc-(?:number|csc|exp|name)/i.test(metadata);
    }
    const heading = [...doc.querySelectorAll("h1,h2,header")].filter(visible).map(el=>(el.textContent || "").slice(0,240)).join(" ");
    return {
      host: doc.location.hostname,
      kind: code ? "code" : payment ? "payment" : "",
      claimed: /\bpearl mobile\b/i.test(doc.title + " " + heading)
    };
  }

  const top = readDocument(document);
  const reports = [top];
  let incomplete = false;
  function readFrames(doc) {
    for (const frame of doc.querySelectorAll("iframe, frame")) {
      if (!visible(frame)) continue;
      const child = frame.contentDocument;
      if (!child?.location || child.readyState === "loading") {
        incomplete = true;
        continue;
      }
      const report = readDocument(child);
      report.host ||= doc.location.hostname || top.host;
      reports.push(report);
      readFrames(child);
    }
  }
  if (includeFrames) readFrames(document);
  return { top, reports, incomplete };
}
