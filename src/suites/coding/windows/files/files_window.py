from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.viewer.window import Window
from engine.viewer.window_read_search import WindowReadSearch
from suites.coding.support.skeletons import CODING_FILES_SKELETON
from suites.coding.windows.files.keys.entries_key import EntriesKey
from suites.coding.windows.files.keys.matches_key import MatchesKey
from suites.coding.windows.files.keys.file_key import FileKey


class FilesWindow(Window):
    """The project's files and folders, with a search for a file by name."""

    name = "coding.files"
    title = "Files"
    entry = "files.js"
    loading = WindowLoading.COMPONENT
    skeleton = CODING_FILES_SKELETON
    place = WindowPlace.PANE_PAGE
    group = "project"
    icon = WindowIcon.FILE
    reads = ["project-file list", "project-file find", "project-file grep", "project-file show", "file-edit list"]
    search = WindowReadSearch("project-file find", "Find a file in the project")
    keys = [EntriesKey, MatchesKey, FileKey]
