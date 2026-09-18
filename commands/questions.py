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
    "commands": (('journal questions add "<question>" --description="<the context>" --option="<a choice>"', "ask one, with choices the user can pick"),
                 ('journal questions answer <n> "<answer>"', "answer it, or add a new answer"),
                 ("journal questions show <n>", "read one in full")),
}


class List(Resource):
    signature = "questions:list " + LISTING
    casts = LISTING_CASTS
    default = True
    controller = CONTROLLER
    action = "index"

    def extra(self, p: Parsed):
        return {"cap": CATALOGUE_PAGE}

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


def options_of(p: Parsed) -> list[dict]:
    out: list[dict] = []
    for name, value in p.options_in_order():
        if name == "option":
            out.append({"label": value or "", "description": "", "code": ""})
        elif name in ("option-description", "option-code") and out:
            out[-1]["description" if name == "option-description" else "code"] = value or ""
    return out


class Add(Resource):
    signature = ("questions:add {text* : the question, in one short line} {--about=*} {--description=} {--option=*}"
                 " {--option-description=*} {--option-code=*} {--pick=}")
    writes = True
    controller = CONTROLLER
    action = "store"

    def extra(self, p: Parsed):
        return {"options": options_of(p), **({"pick": p.option("pick")} if p.option("pick") else {})}


class Edit(Resource):
    signature = ("questions:edit {n : a question number} {text* : the question, reworded} {--description=} {--option=*}"
                 " {--option-description=*} {--option-code=*} {--pick=}")
    casts = QUESTION
    writes = True
    controller = CONTROLLER
    action = "update"

    def extra(self, p: Parsed):
        return {**({"options": options_of(p)} if p.option("option") else {}),
                **({"pick": p.option("pick")} if p.option("pick") else {})}


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
