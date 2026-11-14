from engine.enums.auto_scroll import AutoScroll
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_shows import WindowShows
from engine.viewer.window import Window
from engine.viewer.window_search import WindowSearch
from suites.coding.support.file_edit_searcher import FileEditSearcher
from suites.coding.support.skeletons import CODING_FILE_FEED_SKELETON
from suites.coding.windows.file_edit_reads import FILE_EDIT_READS
from suites.coding.windows.file_feed.keys.agent_edits_key import AgentEditsKey
from suites.coding.windows.file_feed.keys.view_key import ViewKey
from suites.coding.windows.file_feed.keys.edit_file_key import EditFileKey


class FileFeedWindow(Window):
    """The files the agent shown edited, newest last, with a filter."""

    name = "coding.file-feed"
    title = "File feed"
    entry = "file-feed.js"
    loading = WindowLoading.COMPONENT
    skeleton = CODING_FILE_FEED_SKELETON
    search = WindowSearch(FileEditSearcher, "Filter files")
    icon = WindowIcon.FILE
    shows = WindowShows.SELECTED_AGENT
    auto_scroll = AutoScroll.BOTTOM
    reads = [*FILE_EDIT_READS, "file-edit file", "window setting"]
    events = ["file_edit.create"]
    keys = [AgentEditsKey, ViewKey, EditFileKey]
