from __future__ import annotations

import inbox
from app import CATALOGUE_PAGE, answer, catalogue, now, refuse, root
from command import Command, Parsed, number
from commands.options import LISTING_CASTS, words
from templates import render

NOUNS = (("inbox",),)

MESSAGE = {"n": number("a message number")}

PAGE = {
    "sub": "{waiting} waiting, {processed} processed",
    "empty": "The inbox is empty.",
    "lead": "Messages the user left for the agent on this environment, waiting ones first. Each is split into "
            "parts, and each part says what it became: a to-do, a pin, a rule, a reminder, a work update, a "
            "question, or noted.",
    "commands": (('journal inbox "<message>"', "leave one"),
                 ("journal inbox show <n>", "read one, with what it became"),
                 ('journal inbox process <n> --part="<words>" --became=<ref>', "record a part"),
                 ("journal inbox done <n>", "mark it processed")),
}


class List(Command):
    signature = "inbox:list {--page=1} {--order=desc}"
    casts = LISTING_CASTS
    default = True

    def run(self, p: Parsed) -> int:
        waiting = len(inbox.unprocessed(root()))
        page, order = p.option("page"), p.option("order")
        return catalogue(
            "INBOX", render(PAGE["sub"], waiting=waiting, processed=len(inbox._all(root())) - waiting),
            inbox.listing(root(), cap=CATALOGUE_PAGE, page=page, order=order),
            PAGE["empty"], PAGE["lead"], PAGE["commands"], noun="inbox", page=page, order=order)


class Show(Command):
    signature = "inbox:show {n : a message number}"
    casts = MESSAGE
    default = True

    def run(self, p: Parsed) -> int:
        ok, msg = inbox.show(root(), p.arg("n"))
        if not ok:
            return refuse(msg)
        print(msg)
        return 0


class Add(Command):
    signature = "inbox:add {text* : the message}"
    casts = {"text": words("a message")}
    default = True
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(inbox.add(root(), p.arg("text"), now()))


class Process(Command):
    signature = "inbox:process {n : a message number} {--part=} {--became=*}"
    casts = MESSAGE
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(inbox.process(root(), p.arg("n"), p.option("part"), p.option("became"), now()))


class Done(Command):
    signature = "inbox:done {n : a message number}"
    casts = MESSAGE
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(inbox.done(root(), p.arg("n"), now()))


COMMANDS = (List, Show, Add, Process, Done)
