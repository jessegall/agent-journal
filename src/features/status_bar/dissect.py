import re

from features.status_bar.shell import RUNNERS, Piece, parsed
from features.status_bar.spoken import spoken
from dataclasses import dataclass

from features.status_bar.runs import CommandRun, Delta, Outcome

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


def arg_name(arg: str) -> str:
    return base(arg) if arg.strip(".") == "" else arg


@dataclass(frozen=True)
class Name:
    value: str
    whole: bool = False
    columnar: bool = False
    added: int = 0
    removed: int = 0


@dataclass(frozen=True)
class Dissected:
    kind: str
    hand: bool
    names: tuple
    at: float
    done: float
    result: Outcome | None
    changed: Delta | None


def piece_of(one: CommandRun, kind: str = "") -> Piece | None:
    text = one.command
    roots = {"searches": SEARCHERS, "reads": READERS}.get(kind)
    if roots:
        doing = [p for p in parsed(text, spoken, filtered=False) if does(p, roots)]
        named = [p for p in doing if a_path(p.args)]
        if doing:
            return (named or doing)[0]
    found = [p for p in parsed(text, spoken) if kind in ("", JOURNAL) or not p.own]
    return found[0] if found else None


def does(piece: Piece, roots: tuple) -> bool:
    return piece.root.split(" ")[0] in roots or any("*" in x for x in piece.args)


def git_of(piece: Piece | None) -> str:
    root = piece.root.split(" ") if piece else []
    return GIT_WORDS.get(root[1], "") if len(root) > 1 and root[0] == GIT else ""


def kind_of(one: CommandRun) -> str:
    label = one.effect
    if label in TOUCHED and not one.files and not one.by_hand and one.done:
        label = ""
    elif label or one.by_hand:
        return label
    piece = piece_of(one)
    if piece and piece.own:
        return JOURNAL
    return GIT if git_of(piece) else label


def base(path: str) -> str:
    label = path.rstrip("/") or path
    return HERE if label in (".", "./") else label.rsplit("/", 1)[-1]


def capped(label: str) -> str:
    return label if len(label) <= NAME_CAP else f"{label[:NAME_CAP - 1].rstrip()}…"


def whole(value: str) -> Name:
    return Name(capped(value), whole=True)


def name_part(value: str, columnar: bool = False) -> Name:
    return Name(capped(value), columnar=columnar)


def a_path(args) -> str:
    return next((x for x in args if "/" in x or FILE.match(x)), "")


def names_of(one: CommandRun, kind: str) -> list[Name]:
    if one.by_hand or kind in TOUCHED:
        if one.files:
            return [whole(base(path)) for path in one.files]
        return [name_part(one.subject)] if one.subject else []
    piece = piece_of(one, kind)
    if not piece:
        return []
    if piece.own:
        return [name_part(piece.root, columnar=True)]
    if kind == GIT:
        label = git_of(piece)
        named = " ".join(base(x) for x in piece.args if "/" in x or FILE.match(x))
        return [name_part(f"tracking {named}" if label == GIT_WORDS["add"] and named else label, columnar=True)]
    if kind in NAMED:
        found = a_path(piece.args)
        return [whole(base(found))] if found else []
    if kind in GIVEN:
        return [name_part(" ".join(arg_name(x) for x in piece.args))] if piece.args else []
    if piece.root in RUNNERS:
        found = a_path(piece.args)
        script = SCRIPT if piece.script else ""
        label = base(found) if found else script
        return [name_part(f"{piece.root} {label}".strip())]
    given = piece.args[0] if piece.args else ""
    return [name_part(f"{piece.root} {given}" if " " not in piece.root and WORD.match(given) else piece.root)]


def whole_cloth(one: CommandRun, kind: str) -> str:
    return MADE if kind == "writes" and one.files and all(path in one.made for path in one.files) else kind


def looked(kind: str, names: list[Name]) -> str:
    if kind != "reads" or not names:
        return kind
    labels = [name.value.lower() for name in names]
    if all(label.endswith(PICTURES) for label in labels):
        return "views"
    return "watches" if all(label.endswith(MOVIES) for label in labels) else kind


def dissect(one: CommandRun) -> Dissected:
    kind = kind_of(one)
    names = names_of(one, kind)
    return Dissected(whole_cloth(one, looked(kind, names)), one.by_hand, tuple(names), one.at, one.done, one.result, one.changed)
