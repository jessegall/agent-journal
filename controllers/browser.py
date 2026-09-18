from __future__ import annotations

from pathlib import Path

import browser
from controller import Controller, Payload, Result
from payloads import browser as browser_payloads
from payloads.common import ListingPayload


class BrowserController(Controller):
    resource = "browser"
    noun = "browser ask"
    actions = ("index", "show", "store", "pending", "result", "driver")
    numbered = ("show", "result")
    payloads = {"index": ListingPayload, "store": browser_payloads.AskPayload, "result": browser_payloads.ResultPayload,
                "driver": browser_payloads.DriverPayload}

    def repository(self, root: Path, p: Payload):
        from resources import BrowserAsks
        return BrowserAsks(root, p.env)

    def index(self, root: Path, p: ListingPayload) -> Result:
        rows = [browser.row_response(n, x) for n, x in enumerate(browser._all(root, p.env or None), 1)]
        if not p.all:
            rows = [r for r in rows if not r["done"]]
        return Result("ok", "", rows, {"driver": browser.driver(root, p.env or None)})

    def show(self, root: Path, p: Payload) -> Result:
        items = browser._all(root, p.env or None)
        if not 1 <= p.id <= len(items):
            return Result("missing", browser.say("no_ask", n=p.id))
        return Result("ok", "", browser.row_response(p.id, items[p.id - 1]))

    def store(self, root: Path, p: browser_payloads.AskPayload) -> Result:
        args = [a for a in (p.target or "", p.text or "") if a]
        return Result.of(browser.ask(root, p.op or "", args, p.at, track=p.env or None), created=True)

    def pending(self, root: Path, p: Payload) -> Result:
        return Result("ok", "", browser.pending(root, p.env or None), {"driver": browser.driver(root, p.env or None)})

    def result(self, root: Path, p: browser_payloads.ResultPayload) -> Result:
        return Result.of(browser.finish(root, p.id, bool(p.ok), p.text or "", p.at, track=p.env or None,
                                        files=p.files if isinstance(p.files, list) else None))

    def driver(self, root: Path, p: browser_payloads.DriverPayload) -> Result:
        return Result.of(browser.set_driver(root, bool(p.on), p.url or "", p.title or "", p.at, track=p.env or None))
