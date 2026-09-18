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


def _print_answer(x: dict) -> int:
    import browser
    args = f" {' '.join(x.get('args') or [])}" if x.get("args") else ""
    fmt.say(browser.say("result_text" if x.get("ok") else "result_failed", op=x.get("op", ""), args=args,
                        text=x.get("text") or "(nothing)"), error=not x.get("ok"))
    if x.get("files"):
        fmt.say(browser.say("result_files", paths=x["files"]))
    return 0 if x.get("ok") else 1


class Ask(Resource):
    signature = ('browser:ask {op : shot, text, dom, url, console, click, type, goto, eval or scroll} '
                 '{target*? : a selector, a url or javascript} {--text= : the words to type} '
                 '{--wait= : seconds to wait for the answer, 45 by default; 0 returns at once}')
    writes = True
    controller = CONTROLLER
    action = "store"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        # THE ASK WAITS FOR ITS ANSWER. The extension polls the journal, runs it on the tab, and posts
        # the result within a second or two; this command sits on it and prints it, so the agent
        # reads a page the way it reads a file — and nothing about it goes through the chat.
        import re
        import browser
        from app import root
        m = re.search(r"\(browser (\d+)\)", result.message or "")
        n = int(m.group(1)) if m else 0
        seconds = float(p.option("wait") or 45)
        import state
        got = browser.wait(root(), n, track=state.current_track(root()), seconds=seconds) if n and seconds > 0 else None
        if got is None:
            fmt.say(result.message if seconds <= 0 else browser.say("no_answer", n=n, seconds=int(seconds)), error=seconds > 0)
            return 0 if seconds <= 0 else 1
        return _print_answer(got)


class Browser(Ask):
    signature = ('browser {op : shot, text, dom, url, console, click, type, goto, eval or scroll} '
                 '{target*? : a selector, a url or javascript} {--text= : the words to type} '
                 '{--wait= : seconds to wait for the answer, 45 by default; 0 returns at once}')


class Show(Resource):
    signature = "browser:show {n : a browser ask number}"
    casts = ASK
    controller = CONTROLLER
    action = "show"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        if not result.data.get("done"):
            fmt.say(f"browser ask {result.data['n']} is still waiting for the page")
            return 0
        return _print_answer(result.data)


COMMANDS = (List, Ask, Browser, Show)
