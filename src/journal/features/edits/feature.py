from journal.features.edits.listeners.record_edit import RecordEdit
from journal.features.edits.listeners.snapshot_files import SnapshotFiles
from journal.features.feature import Feature


class EditsFeature(Feature):
    """The files the agent changes, kept as rows: the file edits pane reads them, and shows the same after a return."""

    name = "edits"
    title = "File edits"
    help = "Every file the agent changes, by a tool or a shell command, is kept as an edit with its changed lines; the last five hundred stay."
    listeners = (SnapshotFiles, RecordEdit)
