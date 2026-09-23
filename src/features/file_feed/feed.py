from dataclasses import dataclass
from enum import StrEnum
from pathlib import Path

from providers import PROVIDERS
from providers.payload import EditKind, FileEdit, Hunk
from resources.types import AgentRow

KEEP = 3
MOST_EDITS = 60
MOST_ROWS = 400


class RowKind(StrEnum):
    ADD = "add"
    DEL = "del"
    CTX = "ctx"
    FOLD = "fold"


SIGNS = {"+": RowKind.ADD, "-": RowKind.DEL}


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
    cursor: int
    edits: tuple[Card, ...]


def edits_since(row: AgentRow, since: int) -> Feed:
    provider = PROVIDERS.get(row.provider)
    if not provider or not row.transcript:
        return Feed(since, ())
    edits, cursor = provider().file_edits(Path(row.transcript), since)
    return Feed(cursor, tuple(_card(edit, Path(row.cwd)) for edit in edits[-MOST_EDITS:]))


def _card(edit: FileEdit, project: Path) -> Card:
    rows, last_line = _rows(edit.hunks)
    counted = [row.kind for row in rows]
    kept = () if edit.kind == EditKind.DELETED else _capped(rows)
    first_line = edit.hunks[0].new_start if edit.hunks else 0
    return Card(edit.id, _relative(edit.path, project), edit.kind, edit.at, counted.count(RowKind.ADD), counted.count(RowKind.DEL),
                first_line, last_line, kept)


def _rows(hunks: tuple[Hunk, ...]) -> tuple[list[DiffRow], int]:
    rows, old_end, new_end = [], 0, 0
    for hunk in hunks:
        if rows and hunk.old_start > old_end:
            rows.append(DiffRow.fold(hunk.old_start - old_end))
        old, new = hunk.old_start, hunk.new_start
        body = []
        for line in hunk.lines:
            kind = SIGNS.get(line[:1], RowKind.CTX)
            body.append(DiffRow(kind, old if kind == RowKind.DEL else new, line[1:]))
            old += kind != RowKind.ADD
            new += kind != RowKind.DEL
        rows += _folded(body)
        old_end, new_end = old, new
    return rows, new_end - 1


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


def _relative(path: str, project: Path) -> str:
    where = Path(path)
    if where.is_relative_to(project) and project.is_absolute():
        return str(where.relative_to(project))
    if where.is_relative_to(Path.home()):
        return f"~/{where.relative_to(Path.home())}"
    return path
