# Design comparison

`compare.ts` compares a component, a section or a whole page of the app with the same part of its design, and says
where they differ: padding, borders, distances, texts, line alignment and the pixels.

    node --experimental-strip-types tools/design-compare/compare.ts tools/design-compare/views/settings-general.json

## A view file

A view file names both sides, `design` and `app`. Each side has:

- `url`: a web address, or a file such as the design's `index.html`;
- `steps` taken before the capture: click, fill, press, wait, evaluate, goto (and login on the app side);
- `hide`: selectors drawn invisible, such as clocks;
- `part`: the selector of the component or section to compare; with no part the whole page is compared.

At the top level:

- `labels` maps an app text to the design's word for it, so wording alone never shows as a difference.
- `pairing` is `text` (the default: elements pair by what they say) or `order` (they pair by place, for a part that
  shows other content on each side, such as a list row filled with other tasks).
- `width`, `height` and `theme` (light or dark) set the window both sides open in.
- A step value may name an environment variable as `${NAME}`, such as a password.
- `accepted` lists differences that stay on purpose, each as its report line without the leading dash
  (`"Send" (button) x`), or an element found on one side only as its line with `only in the design` or `only in the
  app` after it, and a reason; they are left out of the count.

The pictures and the report land in `storage/design-compare/<view name>/`, and each run writes the view's line in
`record.json`: when it ran, the hash of the design it ran against and the differences left.

```json
{"name": "settings-general", "width": 1440, "height": 900, "theme": "dark",
 "labels": {"What this journal is called.": "How this journal names itself."},
 "design": {"url": "docs/designs/home-v6/index.html", "steps": [{"click": "role=button[name='Settings']"}],
            "part": "section[aria-label='General']"},
 "app": {"url": "http://localhost:54700/settings", "steps": [{"login": "owner@journal.local"}],
         "part": "section[aria-label='General']"}}
```

## Pages

`pages.ts` lists the pages of the app and their views from `pages.json`. A run first seeds the local journal with the
sample tasks, plans, document and sequence the row and reader views open; the seeders skip what is already there.
