from pathlib import Path

from engine.file.file_access import FileAccess
from engine.checkout.file_fingerprints import FileFingerprints
from engine.git.project_files import ProjectFiles
from core.modules.developer.support.private_data_finding import PrivateDataFinding
from core.modules.developer.support.private_data_scan import PrivateDataScan

PASS_NAME = "private-data"
SLICE_FILES = 40


class PrivateDataPass:
    """One slice of the scan: of the files git tracks, has staged or would track, the first few that are new
    or changed since this pass last saw them are read and judged, and then remembered, so once all are done
    only what changes is looked at."""

    def __init__(self, files: ProjectFiles, changes: FileFingerprints, scan: PrivateDataScan) -> None:
        self.files, self.changes, self.scan = files, changes, scan

    def run(self) -> list[PrivateDataFinding]:
        folder = self.files.folder
        slice_ = self.changes.changed(PASS_NAME, self.files.listed())[:SLICE_FILES]
        findings = [finding for file in slice_ if self.is_text(file) for finding in self.scan.scan(file.relative_to(folder), self.text(file))]
        self.changes.record_finished(PASS_NAME, slice_)
        return findings

    @staticmethod
    def is_text(file: Path) -> bool:
        return b"\0" not in FileAccess.binary(file)

    @staticmethod
    def text(file: Path) -> str:
        return FileAccess.binary(file).decode(errors="replace")
