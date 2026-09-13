from __future__ import annotations

import ideas
import settings as settings_mod
import tracks
from app import CATALOGUE_PAGE, answer, catalogue, now, root, stem
from command import Command, Parsed, number
from commands.options import LISTING, LISTING_CASTS, words
from templates import render

NOUN = ("ideas", "idea")

IDEA = {"n": number("an idea number")}

PAGE = {
    "sub": "{standing} standing[, {dropped} dropped]",
    "empty": "Nothing jotted down yet.",
    "lead": "The project's, not one environment's — unstructured, no owner, no promise. "
            "Write one down small; decide later whether it becomes real work.",
    "commands": (('journal ideas add "<the idea>"', "jot one down"),
                 ('journal ideas promote <n> --title="<to-do title>"', "it became real work, filed on this environment"),
                 ('journal ideas drop <n> "<why>"', "tried, superseded, or not worth it")),
}


class List(Command):
    signature = "ideas:list " + LISTING
    casts = LISTING_CASTS
    default = True

    def run(self, p: Parsed) -> int:
        n = len(ideas.live(root()))
        every = bool(p.option("all"))
        page, order = p.option("page"), p.option("order")
        dropped = len(ideas._all(root())) - n if every else 0
        return catalogue(
            "IDEAS", render(PAGE["sub"], standing=n, dropped=dropped),
            ideas.listing(root(), all_of_them=every, cap=CATALOGUE_PAGE, page=page, order=order),
            PAGE["empty"], PAGE["lead"], PAGE["commands"], noun="ideas", page=page, order=order)


class Add(Command):
    signature = "ideas:add {text* : the idea, in one line}"
    casts = {"text": words("an idea")}
    default = True
    writes = True

    def run(self, p: Parsed) -> int:
        conf, _ = settings_mod.load(root())
        return answer(ideas.add(root(), p.arg("text"), now(), conf["idea_max_chars"]))


class Drop(Command):
    signature = "ideas:drop {n : an idea number} {why* : why it is dropped}"
    casts = IDEA
    verbs = ("strike",)
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(ideas.drop(root(), p.arg("n"), p.arg("why"), now()))


class Promote(Command):
    signature = "ideas:promote {n : an idea number} {--title=}"
    casts = IDEA
    writes = True

    def run(self, p: Parsed) -> int:
        return answer(ideas.promote(root(), p.arg("n"), now(), tracks.current(root(), stem()),
                                    p.option("title") or ""))


COMMANDS = (List, Add, Drop, Promote)
