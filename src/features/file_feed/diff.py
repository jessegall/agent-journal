import difflib
from dataclasses import dataclass
from enum import StrEnum
from pathlib import Path

from engine.files import blob_texts

KEEP = 3
MOST_ROWS = 400
MOST_DIFFS = 2000


class RowKind(StrEnum):
    ADD = "add"
    DEL = "del"
    CTX = "ctx"
    FOLD = "fold"


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


DIFFS: dict[tuple[str, str], Diff] = {}


def diffed(project: Path, pairs: list[tuple[str, str]]) -> None:
    missing = list(dict.fromkeys(pair for pair in pairs if pair not in DIFFS))
    texts = blob_texts(project, [sha for pair in missing for sha in pair])
    for before, after in (pair for pair in missing if pair[0] in texts and pair[1] in texts):
        DIFFS[(before, after)] = Diff.between(texts[before].splitlines(), texts[after].splitlines())
    for pair in list(DIFFS)[:max(0, len(DIFFS) - MOST_DIFFS)]:
        del DIFFS[pair]


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
