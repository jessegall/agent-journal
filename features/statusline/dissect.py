import re

from features.statusline.shell import RUNNERS, parsed
from features.statusline.spoken import spoken
from resources.types import COMMAND

JOURNAL = "journal"
GIT = "git"
GIT_WORDS = {"add": "tracking", "commit": "committing changes", "push": "pushing changes", "pull": "pulling changes",
             "fetch": "fetching", "clone": "cloning", "init": "starting a repository", "tag": "tagging",
             "checkout": "switching branch", "switch": "switching branch", "branch": "branching", "merge": "merging",
             "rebase": "rebasing", "stash": "stashing", "reset": "resetting", "restore": "restoring", "cherry-pick": "picking"}
TOUCHED = ("writes", "deletes")
NAMED = ("reads", "tests")
GIVEN = ("installs", "searches")
SEARCHERS = ("grep", "rg", "ag", "find", "fd")
READERS = ("cat", "head", "tail", "less", "sed", "wc", "ls", "stat", "file", "diff", "git")
FILE = re.compile(r"^[\w.-]+\.\w+$")
PICTURES = (".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".heic", ".pdf")
MOVIES = (".mp4", ".mov", ".webm", ".m4v", ".avi")
NAME_CAP = 42


def by_hand(one: dict) -> bool:
    return (one.get(COMMAND.tool) or "Bash") != "Bash"


def piece_of(one: dict, kind: str = "") -> dict:
    what = one.get(COMMAND.what) or ""
    roots = {"searches": SEARCHERS, "reads": READERS}.get(kind)
    if roots:
        own = [p for p in parsed(what, spoken, filtered=False) if does(p, roots)]
        named = [p for p in own if a_path(p["args"])]
        if named or own:
            return (named or own)[0]
    found = parsed(what, spoken)
    return found[0] if found else {}


def does(piece: dict, roots: tuple) -> bool:
    return piece["root"].split(" ")[0] in roots or any("*" in x for x in piece["args"])


def git_of(piece: dict) -> str:
    root = (piece.get("root") or "").split(" ")
    return GIT_WORDS.get(root[1]) if len(root) > 1 and root[0] == GIT else None


def kind_of(one: dict) -> str:
    said = one.get(COMMAND.effect) or ""
    if said in TOUCHED and not one.get(COMMAND.files) and not by_hand(one) and one.get(COMMAND.done):
        said = ""
    elif said or by_hand(one):
        return said
    piece = piece_of(one)
    if piece.get("own"):
        return JOURNAL
    return GIT if git_of(piece) else said


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
    if by_hand(one) or kind in TOUCHED:
        if one.get(COMMAND.files):
            return [whole(base(path)) for path in one[COMMAND.files]]
        return [said_name(one[COMMAND.subject])] if one.get(COMMAND.subject) else []
    piece = piece_of(one, kind)
    if not piece:
        return []
    if piece["own"]:
        return [said_name(piece["root"])]
    if kind == GIT:
        said = git_of(piece)
        return [said_name(f"{said} {' '.join(piece['args'])}".strip() if said == GIT_WORDS["add"] else said)]
    if kind in NAMED:
        found = a_path(piece["args"])
        return [whole(base(found))] if found else []
    if kind in GIVEN:
        return [said_name(" ".join(piece["args"]))] if piece["args"] else []
    if piece["root"] in RUNNERS:
        found = a_path(piece["args"])
        return [said_name(f"{piece['root']} {base(found)}")] if found else [said_name(piece["root"])]
    return [said_name(piece["root"])]


def looked(kind: str, names: list[dict]) -> str:
    if kind != "reads" or not names:
        return kind
    shown = [name["value"].lower() for name in names]
    if all(said.endswith(PICTURES) for said in shown):
        return "views"
    return "watches" if all(said.endswith(MOVIES) for said in shown) else kind


def dissect(one: dict) -> dict:
    kind = kind_of(one)
    names = names_of(one, kind)
    return {
        "kind": looked(kind, names),
        "hand": by_hand(one),
        "names": names,
        "at": float(one.get(COMMAND.at) or 0),
        "done": float(one.get(COMMAND.done) or 0),
        "result": one.get(COMMAND.result) or {},
        "changed": one.get(COMMAND.changed) or {},
    }
