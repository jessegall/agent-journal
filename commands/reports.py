from __future__ import annotations

import fmt
from app import BRIEF_REFUSED, CATALOGUE_PAGE, brief, catalogue, refuse
from command import Parsed, number
from commands.options import LISTING, LISTING_CASTS
from commands.resource import Resource
from controllers.reports import ReportsController
from templates import render

NOUNS = (("reports", "report"),)

REPORT = {"n": number("a report number")}
CONTROLLER = ReportsController()

PAGE = {
    "sub": "{n} on this environment[, {archived} archived (--all)]",
    "empty": "No reports yet.",
    "lead": "What the user asked to have checked or researched, written for the user to read: the situation as it "
            "was when it was written. A report is not a doc, and no session is handed one.",
    "commands": (('journal reports add "<title>" [--about="todo 22"] --brief', "file one, its text on stdin"),
                 ("journal reports show <n>", "read one"),
                 ('journal reports archive <n> "<why>"', "take one off the list")),
    "show": "REPORT {n}  {title}\n  {meta}\n\n{body}",
}


class List(Resource):
    signature = "reports:list " + LISTING
    casts = LISTING_CASTS
    default = True
    controller = CONTROLLER
    action = "index"

    def extra(self, p: Parsed):
        return {"cap": CATALOGUE_PAGE}

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        items = [fmt.Item(n=r["n"], text=r["title"], meta=r["meta"], struck=bool(r["archived"])) for r in result.data]
        return catalogue("REPORTS", render(PAGE["sub"], n=len(result.data) + result.meta["left"],
                                           archived=result.meta["archived"] or None),
                         (items, result.meta["left"]), PAGE["empty"], PAGE["lead"], PAGE["commands"],
                         noun="reports", page=p.option("page"), order=p.option("order"))


class Show(Resource):
    signature = "reports:show {n : a report number}"
    casts = REPORT
    default = True
    controller = CONTROLLER
    action = "show"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        d = result.data
        print(render(PAGE["show"], n=d["n"], title=d["title"], meta=d["meta"], body=fmt.prose(d["body"])))
        return 0


class Add(Resource):
    signature = "reports:add {title* : the report's title} {--about=} {--brief}"
    writes = True
    controller = CONTROLLER
    action = "store"

    def extra(self, p: Parsed):
        body = brief(bool(p.option("brief")))
        if body is None:
            return refuse(BRIEF_REFUSED)
        return {"body": body}


class Archive(Resource):
    signature = "reports:archive {n : a report number} {why* : why it is taken off the list}"
    casts = REPORT
    writes = True
    controller = CONTROLLER
    action = "destroy"


class Keep(Resource):
    signature = "reports:keep {days : days a report stays listed on this environment, 0 to keep them}"
    casts = {"days": number("a number of days")}
    writes = True
    controller = CONTROLLER
    action = "keep"


COMMANDS = (List, Show, Add, Archive, Keep)
