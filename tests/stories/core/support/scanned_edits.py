import json
from collections.abc import Mapping, Sequence
from pathlib import Path


def scanned_edit(story, session: str, path: str, added: int = 1, removed: int = 0, existed: bool = True, rows: Sequence[Mapping[str, object]] = (), folder: Path | None = None) -> None:
    report = story.home.folder / "scan-report.json"
    change = {"diff": {"path": path, "existed": existed, "lines_added": added, "lines_removed": removed}, "rows": list(rows)}
    report.write_text(json.dumps({"folder": str(folder or story.home.project_folder), "changes": [change]}))
    story.expect_success(f"file-edit record-changes {report} --session {session}")


def scanned_edits(story, session: str, paths: Sequence[str]) -> None:
    """One scan report that found every path changed by one line, recorded in one request."""
    report = story.home.folder / "scan-report.json"
    changes = [{"diff": {"path": path, "existed": True, "lines_added": 1, "lines_removed": 0}, "rows": []} for path in paths]
    report.write_text(json.dumps({"folder": str(story.home.project_folder), "changes": changes}))
    story.expect_success(f"file-edit record-changes {report} --session {session}")
