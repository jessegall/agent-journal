from __future__ import annotations

import fmt
import plans
from app import BRIEF_REFUSED, CATALOGUE_PAGE, brief, catalogue, refuse
from command import Parsed, number
from commands.options import LISTING, LISTING_CASTS
from commands.resource import Resource
from controllers.plans import PlansController
from templates import render

NOUNS = (("plans", "plan"),)

PLAN = {"n": number("a plan number")}
CONTROLLER = PlansController()

PAGE = {
    "sub": "{n} on this environment[, {abandoned} abandoned (--all)]",
    "empty": "No plans yet.",
    "lead": "What will be done on this environment and in what order: phases, each made of to-dos, complete when its "
            "to-dos are. A plan ends when the work ends; what stays true afterwards belongs in a doc.",
    "commands": (('journal plans add "<title>" --goal="<what is true when it is done>" --brief', "draft one, its approach on stdin"),
                 ('journal plans phase <n> "<title>" --when="<complete when>"', "add a phase"),
                 ("journal plans todos <n> <phase> <to-do numbers>", "put to-dos in a phase"),
                 ("journal plans show <n>", "read one, with its phases"),
                 ('journal plans abandon <n> "<why>"', "stop one")),
}


class List(Resource):
    signature = "plans:list " + LISTING
    casts = LISTING_CASTS
    default = True
    controller = CONTROLLER
    action = "index"

    def extra(self, p: Parsed):
        return {"cap": CATALOGUE_PAGE}

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        items = [fmt.Item(n=r["n"], text=f"{r['title']} ({r['status']})", meta=r["meta"],
                          struck=r["status"] in (plans.DONE, plans.ABANDONED)) for r in result.data]
        return catalogue("PLANS", render(PAGE["sub"], n=len(result.data) + result.meta["left"],
                                         abandoned=result.meta["abandoned"] or None),
                         (items, result.meta["left"]), PAGE["empty"], PAGE["lead"], PAGE["commands"],
                         noun="plans", page=p.option("page"), order=p.option("order"))


class Show(Resource):
    signature = "plans:show {n : a plan number}"
    casts = PLAN
    default = True
    controller = CONTROLLER
    action = "show"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        print(plans.render_show(result.data))
        return 0


class Add(Resource):
    signature = "plans:add {title* : the plan's title} {--goal=} {--brief} {--preparing}"
    writes = True
    controller = CONTROLLER
    action = "store"

    def extra(self, p: Parsed):
        body = brief(bool(p.option("brief")))
        if body is None:
            return refuse(BRIEF_REFUSED)
        return {"body": body}


class Edit(Resource):
    """Correct a plan's title, goal or approach — what is not given stays."""
    signature = "plans:edit {n : a plan number} {title?* : the plan's title, reworded} {--goal=} {--brief}"
    casts = PLAN
    writes = True
    controller = CONTROLLER
    action = "update"

    def extra(self, p: Parsed):
        if not p.option("brief"):
            return {}
        body = brief(True)
        if body is None:
            return refuse(BRIEF_REFUSED)
        return {"body": body}


class FromDoc(Resource):
    signature = "plans:from-doc {doc : a doc number or name}"
    writes = True
    controller = CONTROLLER
    action = "fromdoc"


class Phase(Resource):
    signature = "plans:phase {n : a plan number} {title* : the phase's title} {--when=} {--checkpoint}"
    casts = PLAN
    writes = True
    controller = CONTROLLER
    action = "phase"


class Todos(Resource):
    signature = "plans:todos {n : a plan number} {phase : a phase number} {todos* : to-do numbers} {--off} {--move} {--reopen=}"
    casts = {**PLAN, "phase": number("a phase number")}
    writes = True
    controller = CONTROLLER
    action = "todos"


class Activate(Resource):
    signature = "plans:activate {n : a plan number}"
    casts = PLAN
    writes = True
    controller = CONTROLLER
    action = "activate"


class Continue(Resource):
    signature = "plans:continue {n : a plan number}"
    casts = PLAN
    writes = True
    controller = CONTROLLER
    action = "proceed"


class Ready(Resource):
    signature = "plans:ready {n : a plan number}"
    casts = PLAN
    writes = True
    controller = CONTROLLER
    action = "ready"


class Park(Resource):
    signature = "plans:park {n : a plan number} {why* : why it is set aside}"
    casts = PLAN
    writes = True
    controller = CONTROLLER
    action = "park"


class Acknowledge(Resource):
    signature = "plans:acknowledge {n : a plan number}"
    casts = PLAN
    writes = True
    controller = CONTROLLER
    action = "acknowledge"


class Abandon(Resource):
    signature = "plans:abandon {n : a plan number} {why* : why it is stopped}"
    casts = PLAN
    writes = True
    controller = CONTROLLER
    action = "destroy"


class Link(Resource):
    signature = "plans:link {n : a plan number} {ref* : doc 4, doc 4.2, report 1 or transcript 25}"
    casts = PLAN
    writes = True
    controller = CONTROLLER
    action = "link"


COMMANDS = (Edit, List, Show, Add, FromDoc, Phase, Todos, Activate, Continue, Ready, Park, Acknowledge, Abandon, Link)
