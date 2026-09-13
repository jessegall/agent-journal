from __future__ import annotations

import fmt
import questions
from app import CATALOGUE_PAGE, catalogue
from command import Parsed, number
from commands.options import LISTING, LISTING_CASTS
from commands.resource import Resource
from controllers.questions import QuestionsController
from templates import render

NOUNS = (("questions", "question"),)

QUESTION = {"n": number("a question number")}
CONTROLLER = QuestionsController()

PAGE = {
    "sub": "{open} open, {answered} answered",
    "empty": "Nothing has been asked yet.",
    "lead": "This environment's questions, open first. A question can be about any number of "
            "to-dos, docs, pins, rules and inbox messages; answering one tells the agent at its next stop.",
    "commands": (('journal questions add "<question>" --about="todo 22"', "ask one, linked to what it is about"),
                 ('journal questions answer <n> "<answer>"', "answer it, or add a new answer"),
                 ("journal questions show <n>", "read one in full")),
}


class List(Resource):
    signature = "questions:list " + LISTING
    casts = LISTING_CASTS
    default = True
    controller = CONTROLLER
    action = "index"

    def payload(self, p: Parsed):
        got = p.payload()
        got.fields["cap"] = CATALOGUE_PAGE
        return got

    def render(self, p: Parsed, result) -> int:
        items = [fmt.Item(n=r["n"], text=r["text"], meta=r["meta"], struck=r["status"] == "withdrawn") for r in result.data]
        return catalogue(
            "QUESTIONS", render(PAGE["sub"], open=result.meta["open"], answered=result.meta["answered"]),
            (items, result.meta["left"]), PAGE["empty"], PAGE["lead"], PAGE["commands"],
            noun="questions", page=p.option("page"), order=p.option("order"))


class Show(Resource):
    signature = "questions:show {n : a question number}"
    casts = QUESTION
    default = True
    controller = CONTROLLER
    action = "show"

    def render(self, p: Parsed, result) -> int:
        if not result.ok:
            return super().render(p, result)
        print(questions.show_text(result.data))
        return 0


class Add(Resource):
    signature = "questions:add {text* : the question} {--about=*}"
    writes = True
    controller = CONTROLLER
    action = "store"


class Edit(Resource):
    signature = "questions:edit {n : a question number} {text* : the question, reworded}"
    casts = QUESTION
    writes = True
    controller = CONTROLLER
    action = "update"


class Answer(Resource):
    signature = "questions:answer {n : a question number} {answer* : the answer}"
    casts = QUESTION
    writes = True
    controller = CONTROLLER
    action = "answer"


class Link(Resource):
    signature = "questions:link {n : a question number} {ref* : a reference like `todo 22` or `doc 4.1`}"
    casts = QUESTION
    writes = True
    controller = CONTROLLER
    action = "link"


class Unlink(Resource):
    signature = "questions:unlink {n : a question number} {ref* : a reference like `todo 22` or `doc 4.1`}"
    casts = QUESTION
    writes = True
    controller = CONTROLLER
    action = "unlink"


class Withdraw(Resource):
    signature = "questions:withdraw {n : a question number} {why* : why it no longer needs an answer}"
    casts = QUESTION
    verbs = ("strike",)
    writes = True
    controller = CONTROLLER
    action = "destroy"


COMMANDS = (List, Show, Add, Edit, Answer, Link, Unlink, Withdraw)
