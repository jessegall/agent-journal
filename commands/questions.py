from __future__ import annotations

import questions
from app import CATALOGUE_PAGE, answer, catalogue, now, refuse, root
from command import Command, Parsed, number
from commands.options import LISTING, LISTING_CASTS
from templates import render

NOUN = ("questions", "question")

QUESTION = {"n": number("a question number")}

PAGE = {
    "sub": "{open} open, {answered} answered",
    "empty": "Nothing has been asked yet.",
    "lead": "This environment's questions, open first. A question can be about any number of "
            "to-dos, docs, pins and rules; answering one tells the agent at its next stop.",
    "commands": (('journal questions add "<question>" --about="todo 22"', "ask one, linked to what it is about"),
                 ('journal questions answer <n> "<answer>"', "answer it"),
                 ("journal questions show <n>", "read one in full")),
}


class List(Command):
    signature = "questions:list " + LISTING
    casts = LISTING_CASTS
    default = True

    def run(self, p: Parsed) -> int:
        standing = [q for q in questions._all(root()) if not q.get("withdrawn")]
        n = len(questions.open_items(root()))
        page, order = p.option("page"), p.option("order")
        return catalogue(
            "QUESTIONS", render(PAGE["sub"], open=n, answered=len(standing) - n),
            questions.listing(root(), all_of_them=bool(p.option("all")), cap=CATALOGUE_PAGE, page=page, order=order),
            PAGE["empty"], PAGE["lead"], PAGE["commands"], noun="questions", page=page, order=order)


class Show(Command):
    signature = "questions:show {n : a question number}"
    casts = QUESTION
    default = True

    def run(self, p: Parsed) -> int:
        ok, msg = questions.show(root(), p.arg("n"))
        if not ok:
            return refuse(msg)
        print(msg)
        return 0


class Add(Command):
    signature = "questions:add {text* : the question} {--about=*}"
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(questions.add(root(), p.arg("text"), now(), p.option("about")))


class Answer(Command):
    signature = "questions:answer {n : a question number} {answer* : the answer}"
    casts = QUESTION
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(questions.answer(root(), p.arg("n"), p.arg("answer"), now()))


class Link(Command):
    signature = "questions:link {n : a question number} {ref* : a reference like `todo 22` or `doc 4.1`}"
    casts = QUESTION
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(questions.link(root(), p.arg("n"), p.arg("ref")))


class Unlink(Command):
    signature = "questions:unlink {n : a question number} {ref* : a reference like `todo 22` or `doc 4.1`}"
    casts = QUESTION
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(questions.unlink(root(), p.arg("n"), p.arg("ref")))


class Withdraw(Command):
    signature = "questions:withdraw {n : a question number} {why* : why it no longer needs an answer}"
    casts = QUESTION
    verbs = ("strike",)
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(questions.withdraw(root(), p.arg("n"), p.arg("why"), now()))


COMMANDS = (List, Show, Add, Answer, Link, Unlink, Withdraw)
