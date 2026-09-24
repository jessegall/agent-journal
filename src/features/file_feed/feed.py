import difflib
from dataclasses import asdict, dataclass
from enum import StrEnum
from pathlib import Path

from engine.events import FileEdited
from engine.files import KIND, blob_texts

KEEP = 3
KEPT = 500
PAGE = 25
MOST_ROWS = 400
MOST_DIFFS = 2000
NOTES = "file_feed"


class EditKind(StrEnum):
    EDIT = "edit"
    NEW = "new"
    DELETED = "deleted"


class RowKind(StrEnum):
    ADD = "add"
    DEL = "del"
    CTX = "ctx"
    FOLD = "fold"


KINDS = {KIND.created: EditKind.NEW, KIND.edited: EditKind.EDIT, KIND.deleted: EditKind.DELETED}


@dataclass(frozen=True)
class DiffRow:
    kind: RowKind
    line: int | None
    text: str
    hidden: int = 0

    @classmethod
    def fold(cls, hidden: int) -> "DiffRow":
        return cls(RowKind.FOLD, None, "", hidden)


@dataclass(frozen=True)
class Diff:
    rows: tuple[DiffRow, ...]
    added: int
    removed: int
    first_line: int
    last_line: int

    @classmethod
    def between(cls, old: list[str], new: list[str]) -> "Diff":
        groups = [group for group in difflib.SequenceMatcher(None, old, new).get_grouped_opcodes(KEEP) if any(op[0] != "equal" for op in group)]
        rows, old_end = [], 0
        for group in groups:
            if rows and group[0][1] > old_end:
                rows.append(DiffRow.fold(group[0][1] - old_end))
            rows += _folded([row for op in group for row in _changed(op, old, new)])
            old_end = group[-1][2]
        counted = [row.kind for row in rows]
        first, last = (groups[0][0][3] + 1, groups[-1][-1][4]) if groups else (0, 0)
        return cls(_capped(rows), counted.count(RowKind.ADD), counted.count(RowKind.DEL), first, last)


@dataclass(frozen=True)
class Card:
    id: str
    path: str
    kind: EditKind
    at: float
    added: int
    removed: int
    first_line: int
    last_line: int
    rows: tuple[DiffRow, ...]


@dataclass(frozen=True)
class Feed:
    cursor: float
    edits: tuple[Card, ...]
    older: bool


@dataclass(frozen=True)
class Page:
    edits: tuple[Card, ...]
    older: bool


@dataclass(frozen=True)
class FileText:
    path: str
    text: str


class Side(StrEnum):
    BEFORE = "before"
    AFTER = "after"


class NoSuchEdit(LookupError):
    pass


DIFFS: dict[tuple[str, str], Diff] = {}


def noted(record, edit: FileEdited) -> None:
    with record.state(NOTES).changing() as held:
        held["notes"] = [*held.get("notes", []), asdict(edit)][-KEPT:]
    diffed(record.root.parent, [(edit.before, edit.after)])


def notes(record) -> list[FileEdited]:
    return [FileEdited.from_json(raw) for raw in record.state(NOTES).get("notes", [])]


def agent_notes(record, agent: int) -> list[FileEdited]:
    return [note for note in notes(record) if note.agent == agent]


def edits_since(record, agent: int, since: float, last: int) -> Feed:
    kept = agent_notes(record, agent)
    shown = [note for note in kept if note.at > since][-last:]
    return Feed(shown[-1].at if shown else since, cards(record, shown), bool(shown) and kept[0].at < shown[0].at)


def edits_before(record, agent: int, before: float, last: int) -> Page:
    kept = agent_notes(record, agent)
    shown = [note for note in kept if note.at < before][-last:]
    return Page(cards(record, shown), bool(shown) and kept[0].at < shown[0].at)


def edited_file(record, agent: int, card: str, side: Side) -> FileText:
    note = next((note for note in agent_notes(record, agent) if card_id(note) == card), None)
    if note is None:
        raise NoSuchEdit(f"no edit {card}")
    sha = note.after if side == Side.AFTER else note.before
    texts = blob_texts(record.root.parent, [sha])
    if sha not in texts:
        raise NoSuchEdit(f"the {side} of {card} is no longer kept")
    return FileText(note.path, texts[sha])


def cards(record, shown: list[FileEdited]) -> tuple[Card, ...]:
    diffed(record.root.parent, [(note.before, note.after) for note in shown])
    return tuple(_card(note) for note in shown if (note.before, note.after) in DIFFS)


def card_id(note: FileEdited) -> str:
    return f"{note.path}@{note.at}"


def diffed(project: Path, pairs: list[tuple[str, str]]) -> None:
    missing = list(dict.fromkeys(pair for pair in pairs if pair not in DIFFS))
    texts = blob_texts(project, [sha for pair in missing for sha in pair])
    for before, after in (pair for pair in missing if pair[0] in texts and pair[1] in texts):
        DIFFS[(before, after)] = Diff.between(texts[before].splitlines(), texts[after].splitlines())
    for pair in list(DIFFS)[:max(0, len(DIFFS) - MOST_DIFFS)]:
        del DIFFS[pair]


def _card(note: FileEdited) -> Card:
    diff, kind = DIFFS[(note.before, note.after)], KINDS[note.kind]
    rows = () if kind == EditKind.DELETED else diff.rows
    return Card(card_id(note), note.path, kind, note.at, diff.added, diff.removed, diff.first_line, diff.last_line, rows)


def _changed(op: tuple, old: list[str], new: list[str]) -> list[DiffRow]:
    tag, i1, i2, j1, j2 = op
    if tag == "equal":
        return [DiffRow(RowKind.CTX, j1 + k + 1, old[i1 + k]) for k in range(i2 - i1)]
    return [*(DiffRow(RowKind.DEL, i + 1, old[i]) for i in range(i1, i2)), *(DiffRow(RowKind.ADD, j + 1, new[j]) for j in range(j1, j2))]


def _folded(rows: list[DiffRow]) -> list[DiffRow]:
    out, run = [], []
    for row in [*rows, None]:
        if row and row.kind == RowKind.CTX:
            run.append(row)
            continue
        out += run if len(run) <= 2 * KEEP + 1 else [*run[:KEEP], DiffRow.fold(len(run) - 2 * KEEP), *run[-KEEP:]]
        out += [row] if row else []
        run = []
    return out


def _capped(rows: list[DiffRow]) -> tuple[DiffRow, ...]:
    if len(rows) <= MOST_ROWS:
        return tuple(rows)
    return (*rows[:MOST_ROWS], DiffRow.fold(len(rows) - MOST_ROWS))
