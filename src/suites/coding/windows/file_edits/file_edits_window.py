from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.viewer.window import Window
from engine.viewer.window_search import WindowSearch
from suites.coding.support.file_edit_searcher import FileEditSearcher
from suites.coding.support.skeletons import CODING_FILE_EDITS_SKELETON
from suites.coding.windows.file_edit_reads import FILE_EDIT_READS
from suites.coding.windows.file_edits.keys.edits_key import EditsKey


class FileEditsWindow(Window):
    """Every file edit of the environment, with a filter."""

    name = "coding.file-edits"
    title = "File edits"
    entry = "file-edits.js"
    loading = WindowLoading.COMPONENT
    skeleton = CODING_FILE_EDITS_SKELETON
    search = WindowSearch(FileEditSearcher, "Filter files")
    icon = WindowIcon.COMMIT
    reads = [*FILE_EDIT_READS, "agent list"]
    events = ["file_edit.create"]
    keys = [EditsKey]
