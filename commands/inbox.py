from __future__ import annotations

import fmt
import inbox
from app import CATALOGUE_PAGE, catalogue
from command import Parsed, number
from commands.options import LISTING_CASTS, words
from commands.resource import Resource
from controllers.inbox import InboxController
from templates import render

NOUNS = (("messages", "message", "inbox"),)

MESSAGE = {"n": number("a message number")}
CONTROLLER = InboxController()

PAGE = {
    "sub": "{waiting} waiting, {processed} processed[, {archived} archived (--all)]",
    "empty": "No messages yet.",
    "lead": "Messages the user left for the agent on this environment, waiting ones first. Each is split into "
            "parts, and each part says what it became: a to-do, a pin, a rule, a reminder, a work update, a "
            "question, or noted.",
    "commands": (('journal messages "<message>"', "leave one"),
                 ("journal messages show <n>", "read one, with what it became"),
                 ('journal messages process <n> --part="<words>" --became=<ref>', "record a part"),
                 ('journal messages file <n> <name> "doc <doc>"', "file an attached file into a doc, or keep it"),
                 ('journal messages detach <n> <name> "<why>"', "take a file off a message; it is kept under struck/"),
                 ("journal messages attach <n> --file=<path>", "add a file to a message already sent"),
                 ("journal messages done <n>", "mark it processed"),
                 ('journal messages move <n> "<environment>"', "carry a waiting one to another environment")),
}


class List(Resource):
    signature = "messages:list {--page=1} {--order=desc} {--all}"
    casts = LISTING_CASTS
    default = True
    controller = CONTROLLER
    action = "index"

    def extra(self, p: Parsed):
        return {"cap": CATALOGUE_PAGE}

    def render(self, p: Parsed, result) -> int:
        page, order = p.option("page"), p.option("order")
        items = [fmt.Item(n=r["n"], text=r["gist"], meta=r["facts"]) for r in result.data]
        return catalogue(
            "MESSAGES", render(PAGE["sub"], waiting=result.meta["waiting"], processed=result.meta["processed"],
                               archived=result.meta["archived"] or None),
            (items, result.meta["left"]), PAGE["empty"], PAGE["lead"], PAGE["commands"],
            noun="messages", page=page, order=order)


class Show(Resource):
    signature = "messages:show {n : a message number}"
    casts = MESSAGE
    default = True
    controller = CONTROLLER
    action = "show"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        print(inbox.show_text(result.data))
        return 0


class Waiting(Resource):
    signature = "messages:waiting"
    controller = CONTROLLER
    action = "waiting"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        if not result.data:
            print("No messages waiting.")
            return 0
        print("\n\n".join(inbox.show_text(d) for d in result.data))
        return 0


class Add(Resource):
    signature = "messages:add {text* : the message} {--file=*}"
    casts = {"text": words("a message")}
    default = True
    writes = True
    controller = CONTROLLER
    action = "store"

    def extra(self, p: Parsed):
        return {"files": [{"path": f} for f in p.option("file") or []]}


class File(Resource):
    signature = "messages:file {n : a message number} {name : the attached file} {into* : `doc 4`, or keep}"
    casts = MESSAGE
    writes = True
    controller = CONTROLLER
    action = "file"


class Detach(Resource):
    signature = "messages:detach {n : a message number} {name : the attached file} {why* : why it is removed}"
    casts = MESSAGE
    writes = True
    controller = CONTROLLER
    action = "detach"


class Attach(Resource):
    signature = "messages:attach {n : a message number} {--file=*}"
    casts = MESSAGE
    writes = True
    controller = CONTROLLER
    action = "attach"

    def extra(self, p: Parsed):
        return {"files": [{"path": f} for f in p.option("file") or []]}


class Edit(Resource):
    signature = "messages:edit {n : a message number} {text* : the message, reworded}"
    casts = MESSAGE
    writes = True
    controller = CONTROLLER
    action = "update"


class Process(Resource):
    signature = "messages:process {n : a message number} {--part=} {--became=*}"
    casts = MESSAGE
    writes = True
    controller = CONTROLLER
    action = "process"


class Done(Resource):
    signature = "messages:done {n : a message number}"
    casts = MESSAGE
    writes = True
    controller = CONTROLLER
    action = "done"


class Reply(Resource):
    signature = "messages:reply {n : a message number} {text* : what you did, a clarification, or a call you made}"
    casts = MESSAGE
    writes = True
    controller = CONTROLLER
    action = "reply"


class Archive(Resource):
    signature = "messages:archive {n : a message number} {why* : why it no longer needs anything done}"
    casts = MESSAGE
    writes = True
    controller = CONTROLLER
    action = "destroy"


class Move(Resource):
    signature = "messages:move {n : a message number} {environment* : the environment it moves to}"
    casts = MESSAGE
    writes = True
    controller = CONTROLLER
    action = "move"


COMMANDS = (List, Show, Waiting, Add, Edit, Process, File, Detach, Attach, Done, Reply, Archive, Move)
