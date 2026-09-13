from __future__ import annotations

import questions
from app import CATALOGUE_PAGE, answer, catalogue, now, refuse, root
from command import Arg, Command, Opt, Parsed, number
from commands.options import LISTING
from templates import render

NOUN = ("questions", "question")

QUESTION = Arg("n", number("a question number"), what="a question number")
REF = Arg("ref", rest=True, what="a reference like `todo 22` or `doc 4.1`")

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
    noun, verb, default, opts = "questions", "list", True, LISTING

    def run(self, p: Parsed) -> int:
        standing = [q for q in questions._all(root()) if not q.get("withdrawn")]
        n = len(questions.open_items(root()))
        page, order = p.option("page"), p.option("order")
        return catalogue(
            "QUESTIONS", render(PAGE["sub"], open=n, answered=len(standing) - n),
            questions.listing(root(), all_of_them=bool(p.option("all")), cap=CATALOGUE_PAGE, page=page, order=order),
            PAGE["empty"], PAGE["lead"], PAGE["commands"], noun="questions", page=page, order=order)


class Show(Command):
    noun, verb, default, args = "questions", "show", True, (QUESTION,)

    def run(self, p: Parsed) -> int:
        ok, msg = questions.show(root(), p.arg("n"))
        if not ok:
            return refuse(msg)
        print(msg)
        return 0


class Add(Command):
    noun, verb, writes = "questions", "add", True
    args = (Arg("text", rest=True, what="the question"),)
    opts = (Opt("about", repeat=True),)

    def run(self, p: Parsed) -> int:
        return answer(questions.add(root(), p.arg("text"), now(), p.option("about")))


class Answer(Command):
    noun, verb, writes = "questions", "answer", True
    args = (QUESTION, Arg("answer", rest=True, what="the answer"))

    def run(self, p: Parsed) -> int:
        return answer(questions.answer(root(), p.arg("n"), p.arg("answer"), now()))


class Link(Command):
    noun, verb, writes, args = "questions", "link", True, (QUESTION, REF)

    def run(self, p: Parsed) -> int:
        return answer(questions.link(root(), p.arg("n"), p.arg("ref")))


class Unlink(Command):
    noun, verb, writes, args = "questions", "unlink", True, (QUESTION, REF)

    def run(self, p: Parsed) -> int:
        return answer(questions.unlink(root(), p.arg("n"), p.arg("ref")))


class Withdraw(Command):
    noun, verb, verbs, writes = "questions", "withdraw", ("strike",), True
    args = (QUESTION, Arg("why", rest=True, what="why it no longer needs an answer"))

    def run(self, p: Parsed) -> int:
        return answer(questions.withdraw(root(), p.arg("n"), p.arg("why"), now()))


COMMANDS = (List, Show, Add, Answer, Link, Unlink, Withdraw)
