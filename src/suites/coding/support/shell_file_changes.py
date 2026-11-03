from collections import OrderedDict
from collections.abc import Mapping, Sequence
from difflib import SequenceMatcher
from pathlib import Path

from core.base.driver.diff_count import DiffCount
from suites.coding.support.patch_row import PatchRow
from suites.coding.support.shell_file_change import ShellFileChange
from suites.coding.support.shell_file_state import ShellFileState
from suites.coding.support.shell_read_budget import ShellReadBudget

READ_LIMIT_BYTES = 64 * 1024
READ_LIMIT_LINES = 2048
FILE_LIMIT_FILES = 32
PENDING_LIMIT_COMMANDS = 64
ROW_LIMIT_ROWS = 600


class ShellFileChanges:
    """Compares command snapshots within fixed file, byte, line and pending command limits."""

    def __init__(self) -> None:
        self.pending: OrderedDict[tuple[int, str], dict[str, ShellFileState]] = OrderedDict()

    def capture(self, key: tuple[int, str], folder: str, paths: Sequence[str]) -> None:
        self.pending.pop(key, None)
        states: dict[str, ShellFileState] = {}
        budget = ShellReadBudget(READ_LIMIT_BYTES, READ_LIMIT_LINES)
        for path in paths[:FILE_LIMIT_FILES]:
            state = ShellFileState.read(Path(folder) / path, budget)
            if state is None:
                continue
            states[path] = state
        self.pending[key] = states
        if len(self.pending) > PENDING_LIMIT_COMMANDS:
            self.pending.popitem(last=False)

    def changes(self, key: tuple[int, str], folder: str) -> list[ShellFileChange]:
        states = self.pending.pop(key, {})
        changes: list[ShellFileChange] = []
        budget = ShellReadBudget(READ_LIMIT_BYTES, READ_LIMIT_LINES)
        for path, original_state in states.items():
            current_state = ShellFileState.read(Path(folder) / path, budget)
            if current_state is None:
                continue
            rows = self.changed_rows(original_state.lines, current_state.lines)
            if not rows:
                continue
            changes.append(ShellFileChange(DiffCount(path, original_state.existed, self.counted(rows, "add"), self.counted(rows, "del")), self.limited(rows)))
        return changes

    def discard(self, key: tuple[int, str]) -> None:
        self.pending.pop(key, None)

    @staticmethod
    def changed_rows(original_lines: Sequence[str], current_lines: Sequence[str]) -> list[PatchRow]:
        rows: list[PatchRow] = []
        for group in SequenceMatcher(a=original_lines, b=current_lines).get_grouped_opcodes():
            for operation, old_start, old_end, new_start, new_end in group:
                if operation in ("delete", "replace"):
                    rows.extend(PatchRow("del", index + 1, original_lines[index].rstrip("\r\n")) for index in range(old_start, old_end))
                if operation in ("insert", "replace", "equal"):
                    line_type = "ctx" if operation == "equal" else "add"
                    rows.extend(PatchRow(line_type, index + 1, current_lines[index].rstrip("\r\n")) for index in range(new_start, new_end))
        return rows

    @staticmethod
    def counted(rows: Sequence[PatchRow], line_type: str) -> int:
        return sum(1 for row in rows if row.line_type == line_type)

    @staticmethod
    def limited(rows: Sequence[PatchRow]) -> tuple[Mapping[str, object], ...]:
        listed = [row.listed() for row in rows[:ROW_LIMIT_ROWS]]
        if len(rows) > ROW_LIMIT_ROWS:
            listed.append({"line_type": "fold", "line": 0, "text": "", "hidden": len(rows) - ROW_LIMIT_ROWS})
        return tuple(listed)
