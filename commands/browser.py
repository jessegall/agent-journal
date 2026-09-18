from __future__ import annotations

import fmt
from app import CATALOGUE_PAGE, catalogue
from command import Parsed, number
from commands.options import LISTING, LISTING_CASTS
from commands.resource import Resource
from controllers.browser import BrowserController
from templates import render

NOUNS = (("browser",),)

ASK = {"n": number("a browser ask number")}
CONTROLLER = BrowserController()

PAGE = {
    "sub": "{state}",
    "empty": "Nothing has been asked of the page.",
    "lead": "The page the user is on, through the journal's Chrome extension: a screenshot, its text or DOM, a click, "
            "typing, a url, a line of javascript. Each ask is answered as a message from `browser`, read like any "
            "other. The user switches driving on from the chat window; nothing runs until they have.",
    "commands": (("journal browser shot", "a picture of the page, attached to the answer"),
                 ("journal browser text | dom | url | console", "what the page says, is, is at, or logged"),
                 ('journal browser click "<selector>"', "click it"),
                 ('journal browser type "<selector>" --text="<words>"', "type into it"),
                 ("journal browser goto <url>", "take the page there"),
                 ('journal browser eval "<javascript>"', "run it there; the value comes back"),
                 ('journal browser scroll "<selector>"|top|bottom', "bring it into view")),
}


class List(Resource):
    signature = "browser:list " + LISTING
    casts = LISTING_CASTS
    default = True
    controller = CONTROLLER
    action = "index"

    def extra(self, p: Parsed):
        return {"cap": CATALOGUE_PAGE}

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        items = [fmt.Item(n=r["n"], text=f"{r['op']} {' '.join(r['args'])}".strip(), meta=r["meta"], struck=r["done"])
                 for r in result.data]
        d = result.meta.get("driver")
        state = f"driving {d.get('url') or 'a page'}" if d else "no page is being driven"
        return catalogue("BROWSER", render(PAGE["sub"], state=state), (items, 0), PAGE["empty"], PAGE["lead"],
                         PAGE["commands"], noun="browser", page=p.option("page"), order=p.option("order"))


class Ask(Resource):
    signature = ('browser:ask {op : shot, text, dom, url, console, click, type, goto, eval or scroll} '
                 '{target*? : a selector, a url or javascript} {--text= : the words to type}')
    writes = True
    controller = CONTROLLER
    action = "store"


class Browser(Ask):
    signature = ('browser {op : shot, text, dom, url, console, click, type, goto, eval or scroll} '
                 '{target*? : a selector, a url or javascript} {--text= : the words to type}')


class Show(Resource):
    signature = "browser:show {n : a browser ask number}"
    casts = ASK
    controller = CONTROLLER
    action = "show"


COMMANDS = (List, Ask, Browser, Show)
