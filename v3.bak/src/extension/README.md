# Agent journal — the Chrome extension

A Chrome extension that lets you point at anything in any tab and have the agent told what you
meant — the selector, the page, the text, its opening tag, and a picture of the element itself — as a message in this journal.

## Install

1. `chrome://extensions` → turn on **Developer mode** → **Load unpacked** → pick this folder.
2. Start a viewer if none is running: `journal serve`.

The extension finds every journal itself by asking ports 8420–8439 for `/api/identity` (which also
lists the environments), so nothing needs configuring when a port changes. Which journal and which environment are chosen inside the
chat window's bar.

The extension is a shell. Its window is a frame of the journal's own viewer, and the viewer draws
the window's bar — the switches, the fold, the close — and tells the shell what to do; so a change
to how the window looks or behaves is a journal upgrade, and the extension is reloaded only when
the shell itself (the picker, the background worker, the relay between page and shell) changes.
The popup is one button: **Open the chat here**.

## Use

- **Alt+J**, or **Open the chat here**: the journal opens as a window over the page you are on —
  dragged by its bar, resized from its corner, remembered where you left it. The bar names the
  journal and the environment, and each is a switch: click one to pick another. Beside the clip in
  its write box, a crosshair points at an element of the page under the window (the same as Alt+P)
  and a camera sends a picture of one. The – in the bar folds the window down to the bar and the
  agent's status line, and opens it back up. Open it here and the tab you switch to has it too;
  where it sits and whether it is folded are shared. A tab may go its own way: a journal or
  environment picked in one tab's window is that tab's, and × in a tab closes the window there
  only — a new tab starts on the shared choice. Closing it on the journal's own page puts the chat
  back on the page and closes every window. The extension asks for every site at install, so
  nothing has to be granted later. Alt+J again or Esc closes it in the tab.
- **Alt+P**: a crosshair appears, whatever is under the pointer is outlined, and clicking it sends
  it — the selector, the page, the element's text and a picture. Esc stops without sending.
- **Detach, in the journal's own viewer**: the button beside the ⋮ hands the chat to this
  extension, which opens its window over the page and on every page after it; the page says where
  the chat went, and the same button puts it back.

## What the agent is handed

    I mean this element: `#root > main.panel > button:nth-of-type(2)`
    http://localhost:3000/settings
    "Save changes"
    data-testid="settings-save"
    `<button class="btn primary" data-testid="settings-save">`

with a PNG of the element attached to the message.

## What it cannot do

- A page that Chrome itself owns (`chrome://`, the Web Store) cannot be pointed at: no extension
  may run there.
- The picture is cut out of the visible tab, so an element scrolled out of view is sent without
  one rather than with the wrong one.
- It reaches `127.0.0.1` and `localhost` only. A journal on another machine is out of scope.

## Putting it on the Chrome Web Store, unlisted

One click for everyone who has the link, and Chrome updates them by itself; nobody finds it by
searching. Only the publisher needs an account.

1. https://chrome.google.com/webstore/devconsole — sign in with a Google account and pay the
   one-time $5 developer registration.
2. **New item** → upload the zip the journal serves at `/extension.zip` (Settings → Chrome
   extension → Download). It is already the shape the store wants: `manifest.json` with icons,
   version and description at the top level of the folder.
3. Store listing: the name and description are taken from the manifest; add a 128×128 icon
   (`icons/128.png` in the zip) and at least one screenshot (1280×800) of the window over a page.
4. Privacy: it stores nothing outside the machine — every message goes to a journal viewer on
   127.0.0.1 — and asks for a site's permission only to draw its window there. Say so in the
   privacy fields; the `<all_urls>` optional permission is what "follow me on every page" uses.
5. **Distribution → Visibility: Unlisted.** Submit for review; a first review takes a day or two.
6. When it is published, put the store page's URL in `extension/store.json` and publish the
   journal: Settings then shows **Add to Chrome** above the download.

A new version is the same zip with a higher `version` in `manifest.json`, uploaded as a new
package; installed copies update on their own within hours.
