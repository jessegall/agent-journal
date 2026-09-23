import difflib
from dataclasses import asdict, dataclass
from enum import StrEnum
from pathlib import Path

from engine.events import FileEdited
from engine.files import KIND, blob_texts

KEEP = 3
KEPT = 500
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


DIFFS: dict[tuple[str, str], Diff] = {}


def noted(record, edit: FileEdited) -> None:
    with record.state(NOTES).changing() as held:
        held["notes"] = [*held.get("notes", []), asdict(edit)][-KEPT:]


def notes(record) -> list[FileEdited]:
    return [FileEdited.from_json(raw) for raw in record.state(NOTES).get("notes", [])]


def edits_since(record, agent: int, since: float) -> Feed:
    shown = [note for note in notes(record) if note.agent == agent and note.at > since]
    diffed(record.root.parent, [(note.before, note.after) for note in shown])
    return Feed(shown[-1].at if shown else since, tuple(_card(note) for note in shown if (note.before, note.after) in DIFFS))


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
    return Card(f"{note.path}@{note.at}", note.path, kind, note.at, diff.added, diff.removed, diff.first_line, diff.last_line, rows)


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
