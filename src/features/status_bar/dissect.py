import re

from features.status_bar.shell import RUNNERS, parsed
from features.status_bar.spoken import spoken
from resources.types import COMMAND

JOURNAL = "journal"
GIT = "git"
GIT_WORDS = {"add": "tracking files", "commit": "committing changes", "push": "pushing changes", "pull": "pulling changes",
             "fetch": "fetching changes", "clone": "cloning a repository", "init": "starting a repository", "tag": "tagging a commit",
             "checkout": "switching branch", "switch": "switching branch", "branch": "branching", "merge": "merging a branch",
             "rebase": "rebasing", "stash": "stashing changes", "reset": "resetting changes", "restore": "restoring files",
             "cherry-pick": "picking a commit"}
TOUCHED = ("writes", "deletes")
MADE = "creates"
NAMED = ("reads", "tests")
GIVEN = ("installs", "searches")
SEARCHERS = ("grep", "rg", "ag", "find", "fd")
READERS = ("cat", "head", "tail", "less", "sed", "wc", "ls", "stat", "file", "diff", "git")
FILE = re.compile(r"^[\w.-]+\.\w+$")
PICTURES = (".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".heic", ".pdf")
MOVIES = (".mp4", ".mov", ".webm", ".m4v", ".avi")
NAME_CAP = 42
HERE = "here"
SCRIPT = "script"
WORD = re.compile(r"^[a-z][\w-]*$", re.I)


def by_hand(one: dict) -> bool:
    return (one.get(COMMAND.tool) or "Bash") != "Bash"


def piece_of(one: dict, kind: str = "") -> dict:
    text = one.get(COMMAND.command) or ""
    roots = {"searches": SEARCHERS, "reads": READERS}.get(kind)
    if roots:
        doing = [p for p in parsed(text, spoken, filtered=False) if does(p, roots)]
        named = [p for p in doing if a_path(p["args"])]
        if doing:
            return (named or doing)[0]
    found = [p for p in parsed(text, spoken) if kind in ("", JOURNAL) or not p["own"]]
    return found[0] if found else {}


def does(piece: dict, roots: tuple) -> bool:
    return piece["root"].split(" ")[0] in roots or any("*" in x for x in piece["args"])


def git_of(piece: dict) -> str:
    root = (piece.get("root") or "").split(" ")
    return GIT_WORDS.get(root[1], "") if len(root) > 1 and root[0] == GIT else ""


def kind_of(one: dict) -> str:
    label = one.get(COMMAND.effect) or ""
    if label in TOUCHED and not one.get(COMMAND.files) and not by_hand(one) and one.get(COMMAND.done):
        label = ""
    elif label or by_hand(one):
        return label
    piece = piece_of(one)
    if piece.get("own"):
        return JOURNAL
    return GIT if git_of(piece) else label


def base(path: str) -> str:
    label = path.rstrip("/") or path
    return HERE if label in (".", "./") else label.rsplit("/", 1)[-1]


def capped(label: str) -> str:
    return label if len(label) <= NAME_CAP else f"{label[:NAME_CAP - 1].rstrip()}…"


def whole(value: str) -> dict:
    return {"value": capped(value), "whole": True, "columnar": False}


def name_part(value: str, columnar: bool = False) -> dict:
    return {"value": capped(value), "whole": False, "columnar": columnar}


def a_path(args: list[str]) -> str:
    return next((x for x in args if "/" in x or FILE.match(x)), "")


def names_of(one: dict, kind: str) -> list[dict]:
    if by_hand(one) or kind in TOUCHED:
        if one.get(COMMAND.files):
            return [whole(base(path)) for path in one[COMMAND.files]]
        return [name_part(one[COMMAND.subject])] if one.get(COMMAND.subject) else []
    piece = piece_of(one, kind)
    if not piece:
        return []
    if piece["own"]:
        return [name_part(piece["root"], columnar=True)]
    if kind == GIT:
        label = git_of(piece)
        named = " ".join(base(x) for x in piece["args"] if "/" in x or FILE.match(x))
        return [name_part(f"tracking {named}" if label == GIT_WORDS["add"] and named else label, columnar=True)]
    if kind in NAMED:
        found = a_path(piece["args"])
        return [whole(base(found))] if found else []
    if kind in GIVEN:
        return [name_part(" ".join(base(x) if x.strip(".") == "" else x for x in piece["args"]))] if piece["args"] else []
    if piece["root"] in RUNNERS:
        found = a_path(piece["args"])
        label = base(found) if found else SCRIPT if piece.get("script") else ""
        return [name_part(f"{piece['root']} {label}".strip())]
    given = piece["args"][0] if piece["args"] else ""
    return [name_part(f"{piece['root']} {given}" if " " not in piece["root"] and WORD.match(given) else piece["root"])]


def whole_cloth(one: dict, kind: str) -> str:
    made = one.get(COMMAND.made) or []
    files = one.get(COMMAND.files) or []
    return MADE if kind == "writes" and files and all(path in made for path in files) else kind


def looked(kind: str, names: list[dict]) -> str:
    if kind != "reads" or not names:
        return kind
    labels = [name["value"].lower() for name in names]
    if all(label.endswith(PICTURES) for label in labels):
        return "views"
    return "watches" if all(label.endswith(MOVIES) for label in labels) else kind


def dissect(one: dict) -> dict:
    kind = kind_of(one)
    names = names_of(one, kind)
    return {
        "kind": whole_cloth(one, looked(kind, names)),
        "hand": by_hand(one),
        "names": names,
        "at": float(one.get(COMMAND.at) or 0),
        "done": float(one.get(COMMAND.done) or 0),
        "result": one.get(COMMAND.result) or {},
        "changed": one.get(COMMAND.changed) or {},
    }
