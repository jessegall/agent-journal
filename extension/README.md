# Journal pointer

A Chrome extension that lets you point at anything in any tab and have the agent told what you
meant — the selector, the page, the text, its opening tag, and a picture of the element itself — as a message in this journal.

## Install

1. `chrome://extensions` → turn on **Developer mode** → **Load unpacked** → pick this folder.
2. Start a viewer if none is running: `journal serve`.

The extension finds every journal itself by asking ports 8420–8439 for `/api/identity`, so nothing
needs configuring when a port changes. The popup lists the projects that answered: pick the journal,
then the environment inside it.

## Use

- **Alt+P**, or **Point at an element** in the popup: a crosshair appears, whatever is under the
  pointer is outlined, and clicking it sends it. Esc stops without sending.
- **Alt+J**, or **Open the chat here**: the journal opens as a window over the page you are on —
  dragged by its bar, resized from its corner, remembered where you left it. Alt+J again, Esc, or ×
  closes it.
- **Send a test message** in the popup posts one message with no pointing involved. If the test
  lands and pointing does not, the pointer is at fault; if neither lands, the popup says why.

The popup's dropdown picks which environment the message lands on.

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
