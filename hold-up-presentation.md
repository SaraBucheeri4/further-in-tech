---
marp: true
theme: default
size: 16:9
lang: en
style: |
  section { background: #faf9f4; color: #172e32; font-family: Arial, sans-serif; padding: 66px 88px; font-size: 35px; line-height: 1.35; }
  h1, h2 { font-family: Georgia, serif; font-weight: normal; line-height: 1.08; letter-spacing: -0.035em; }
  h1 { font-size: 78px; } h2 { font-size: 60px; }
  h3 { font-size: 29px; margin-bottom: 0.4em; }
  blockquote { border-left: 6px solid #bb5936; margin-left: 0; padding-left: 24px; color: #172e32; }
  strong { color: #165955; } code { font-size: 0.8em; }
  section.lead { background: #18383a; color: #ffffff; }
  section.lead strong { color: #bfe8d6; }
---

<!-- _class: lead -->

# Two weeks ago, my friend lost all the money in her account.

She thought she was on a payment gateway.

`www[.]dilmunexpress[.]site`

<!--
SLIDE 1 · 0:00–0:28 · Speaker 1
“Two weeks ago, my friend got scammed through this website. She told me it looked like a payment gateway. By the time she realised it was fake, all the money in her account was gone. I don’t want that to happen to me. I know none of you want it to happen to you either. So let me show you where we could have interrupted it.”
Let the address sit on screen for one beat. Keep it plain text. The incident is the friend’s account. The SMS, amount and call on the following slides are a fictional demonstration.
-->

---

## Hold Up

A customer gets a text about a **BD 1.500** bill.  
The link opens a checkout. Then “support” calls.

**Where would you want a warning?**

<!--
SLIDE 2 · 0:28–0:50 · Speaker 1
“Here’s a fictional example. You might catch the text. I might only notice the checkout. Someone else might pick up the phone. Hold Up gives each of us a chance to pause before we pay or give away a code.”
Introduce the product quietly. Set up the phone and desktop side by side. Enable airplane mode, turn off Wi-Fi and cold-start the installed mobile release build. Keep it offline through the SMS and call checks. The story sequence is illustrative and does not require device pairing.
-->

---

## The text says “pay your bill”

> Your bill of BD 1.500 is due. Pay here today.

**Check link** → The linked page asks for card details.  
Your operator lists a different billing address.

**Open official billing**

<!--
SLIDE 3 · 0:50–1:18 · Speaker 2 · SMS demo
Paste the fictional SMS or use Android Share. Tap Check link. Point to the destination and the extracted “pay” request. “You haven’t had to visit the link. The prototype compares its saved page preview with our demo operator’s billing directory. Here the claimed biller and payment destination don’t match.”
Use a stored local fixture. For new or shortened links without reliable evidence, show “Couldn’t verify.” The stage example uses fictional data.
-->

---

## The moment the checkout appears

**Payment details requested**  
This gateway isn’t listed for the operator named on the page.

**Leave page**　　**Open official billing**

<!--
SLIDE 4 · 1:18–1:48 · Speaker 2 · Chrome demo
Open the harmless local checkout. Keep your hands off the keyboard until the notice appears. Then reveal a dynamically added OTP field. “Chrome flags either prompt immediately on detection. It can do that from the labels before you type a single digit.”
Switch briefly to the genuine fixture. It still gets a payment notice, with the listed destination and no disruptive alert. If a frame cannot be inspected, the UI must say coverage is limited. Never open the reported domain on stage.
-->

---

## Listen for the request

> «عشان نحل المشكلة، **عطنا الـ OTP**»

**They’re asking you to read out your login code.**

Keep the code private. End the call and open official support.

<!--
SLIDE 5 · 1:48–2:23 · Speaker 2 · Call demo
Play a recording made with a consenting teammate. Label it “Recorded demo call · transcribed on this phone.” Give the model a moment to caption the line. Point to the highlighted phrase as it appears. Read the English explanation aloud so everyone can follow.
“The speech model turns audio into words on the phone. A small bilingual rule set highlights the request. A phrase like ‘never share your code’ should produce a different result.” If the recogniser misses the line, show a clearly labelled reference transcript. The prototype input is a staged recording. Live operator support calls are a pilot.
-->

---

## The phone can do both checks offline

The **React Native app** checks the selected SMS and transcribes the sample call on the phone.

Messages, links, audio and transcripts stay on the device during analysis.

**The operator supplies official billing addresses and payment partners.**

<!--
SLIDE 6 · 2:23–2:53 · Speaker 1
“All three checks use the same directory, action labels and warning rules. A phone and a laptop can agree about a destination without exchanging anybody’s inbox. The speech model works locally. We mask codes before displaying the transcript and clear it when the session ends. Content on a page has no authority to change where the official billing button goes.”
These are design targets. Before presenting, repeat both checks in a release build with connectivity enabled. Verify that the app sends zero analysis requests and queues nothing to upload on reconnection. A customer opening official billing starts a separate online action.
-->

---

## A prototype an operator can test

**Hackathon** · Chrome extension, React Native app, one recorded bilingual call and a bundled billing directory.

**First pilot** · One operator, its billing partners and opt-in calls within its support app.

<!--
SLIDE 7 · 2:53–3:23 · Speaker 1
“Manifest V3 and TypeScript watch for visible payment and code requests. React Native and TypeScript power the mobile interface. The phone and extension share the same TypeScript rules. The native whisper.rn module runs the bundled multilingual speech model offline. Our first partner would verify the billing directory and help test the opt-in call experience. Ordinary mobile apps have restricted access to cellular call audio.”
“If this works for customers, we can add eligible SMS filtering and tune the speech experience with Gulf Arabic speakers.” Describe components as planned until demonstrated.
-->

---

<!-- _class: lead -->

## Would the warning have arrived in time?

**Before the first digit. Before the code is spoken.**

We’re asking one telecom partner to test this with its customers.

<!--
SLIDE 8 · 3:23–3:55 · Speaker 1
“I keep thinking about the second before my friend typed in her details. That’s the second we want to give back to someone else. Help us test whether a customer can leave a fake checkout, find the real bill, and still pay it with confidence.”
Ask for one billing or fraud lead and a small test across age groups. Measure warnings before input, time to a call alert, genuine checkouts interrupted and customers reaching official billing. Give actual counts only after testing. Read the headline as an ambition. A call warning depends on when the request is audible and understood.
-->

<!--
REHEARSAL NOTES · Off-screen; eight slides, approximately 3 minutes 55 seconds including demo cues. No official pitch length is assumed. If there are two speakers, the storyteller owns slides 1–2 and 6–8 and the demonstrator owns slides 3–5. If the room has no audio, use the captioned demo and identify it as a recording.

What we borrowed from winning presentations
• Argus, 2025 Microsoft Imagine Cup World Champion. Microsoft documented the founders’ grandparents’ experiences, showed the physical prototype and published its final pitch. We adapted the personal origin and the visible demonstration. Here, the observable result is a warning appearing while the presenter’s hands are still off the keyboard. Microsoft's stage photo and account: https://blogs.microsoft.com/bayarea/2025/05/13/stanford-students-vie-to-win-the-2025-imagine-cup-with-a-device-to-help-people-with-low-vision/ . Official final pitch: https://www.youtube.com/watch?v=oAYnlvZD92Q .
• Scamoorai, Most Life-Changing Idea, Singapore’s Hackathon for a Better World 2022. The organisers published the winning pitch summary and the team’s reflection on focusing on a customer pain point. Their app/web concept included call and text detection. Our deck follows one payment request across three places and shows where customers can go after each alert. Organisers’ account, Annex A: https://www.judiciary.gov.sg/news-and-resources/news/news-details/joint-media-release-dbs-singapore-courts-and-national-crime-prevention-council-announce-winners-of-community-hackathon-to-find-solutions-that-foster-a-scam-resilient-society .
• Local relevance: Bahrain TRA and operators’ fraudulent-SMS initiative: https://www.tra.org.bh/en/en/article/tra-bahrain-and-mobile-operators-launch-guidelines-to-combat-fraudulent-sms .

For judges’ questions
• How do you know a site is fake? A payment field triggers the first notice. A known threat or a specific mismatch raises severity. A new merchant, an expired record or a redirect we cannot safely resolve stays unverified. A recognised processor alone cannot establish a merchant’s identity.
• Can a malicious message fool the AI? Treat all external text as data. Speech recognition and local phrase matching supply evidence. Fixed rules decide the warning. Official routes come from a separate directory. In the demo the model has no browser, payment or messaging tools.
• How do you check the linked site? Inspect a locally stored page preview in the demo. When the local directory and stored preview cannot establish a destination, show “Couldn’t verify.” The phone does not send the link to a remote scanner. A new live webpage needs a connection to inspect.
• What if I wish to pay? Open the merchant or operator app independently. A genuine checkout still gets the quiet cue. Check that people can finish genuine tasks as part of the pilot.
• What exists today? These slides describe the proposed prototype. When presenting, demo the pieces that actually run and label every fixture, simulated input and fallback.
-->
