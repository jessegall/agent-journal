import json
from collections.abc import Sequence
from dataclasses import dataclass

from core.base.driver.diff_count import DiffCount
from suites.coding.support.file_change import FileChange


@dataclass(frozen=True)
class FileChangeReport:
    """What a file scan found in a checkout, read from the JSON the scan wrote."""

    folder: str
    changes: Sequence[FileChange]

    @classmethod
    def parsed(cls, text: str) -> "FileChangeReport":
        report = json.loads(text)
        changes = [FileChange(DiffCount(change["diff"]["path"], change["diff"]["existed"], change["diff"]["lines_added"], change["diff"]["lines_removed"]), tuple(change["rows"])) for change in report["changes"]]
        return cls(report["folder"], changes)
