import re

from features.statusline.shell import parsed
from features.statusline.spoken import spoken
from resources.types import COMMAND

JOURNAL = "journal"
TOUCHED = ("writes", "deletes")
NAMED = ("reads", "tests")
GIVEN = ("installs",)
FILE = re.compile(r"^[\w.-]+\.\w+$")
NAME_CAP = 42


def by_hand(one: dict) -> bool:
    return (one.get(COMMAND.tool) or "Bash") != "Bash"


def piece_of(one: dict) -> dict:
    found = parsed(one.get(COMMAND.what) or "", spoken)[:1]
    return found[0] if found else {}


def kind_of(one: dict) -> str:
    said = one.get(COMMAND.effect) or ""
    if said in TOUCHED and not one.get(COMMAND.files):
        return "" if not by_hand(one) else said
    if said or by_hand(one):
        return said
    return JOURNAL if piece_of(one).get("own") else ""


def base(path: str) -> str:
    return path.rsplit("/", 1)[-1]


def capped(said: str) -> str:
    return said if len(said) <= NAME_CAP else f"{said[:NAME_CAP - 1].rstrip()}…"


def whole(value: str) -> dict:
    return {"value": capped(value), "whole": True}


def said_name(value: str) -> dict:
    return {"value": capped(value), "whole": False}


def a_path(args: list[str]) -> str:
    return next((x for x in args if "/" in x or FILE.match(x)), "")


def names_of(one: dict, kind: str) -> list[dict]:
    if one.get(COMMAND.files):
        return [whole(base(path)) for path in one[COMMAND.files]]
    if by_hand(one):
        return [said_name(one[COMMAND.subject])] if one.get(COMMAND.subject) else []
    if kind in TOUCHED:
        return []
    piece = piece_of(one)
    if not piece:
        return []
    if piece["own"]:
        return [said_name(piece["root"])]
    if kind in NAMED:
        found = a_path(piece["args"])
        return [whole(base(found))] if found else []
    if kind in GIVEN:
        return [whole(piece["args"][0])] if piece["args"] else []
    return [said_name(piece["root"])]


def dissect(one: dict) -> dict:
    kind = kind_of(one)
    return {
        "kind": kind,
        "hand": by_hand(one),
        "names": names_of(one, kind),
        "at": float(one.get(COMMAND.at) or 0),
        "done": float(one.get(COMMAND.done) or 0),
        "result": one.get(COMMAND.result) or {},
        "changed": one.get(COMMAND.changed) or {},
    }
