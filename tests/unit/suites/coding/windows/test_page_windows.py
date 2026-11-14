import pytest

from engine.enums.window_loading import WindowLoading
from engine.enums.window_shows import WindowShows
from suites.coding.windows.file_edits.file_edits_window import FileEditsWindow
from suites.coding.windows.file_feed.file_feed_window import FileFeedWindow
from suites.coding.windows.terminal.terminal_window import TerminalWindow


@pytest.mark.parametrize("window, shows", [(FileFeedWindow, WindowShows.SELECTED_AGENT), (TerminalWindow, WindowShows.SELECTED_AGENT), (FileEditsWindow, WindowShows.ENVIRONMENT)])
def test_a_coding_page_window_is_a_component_of_one_agent_or_of_the_environment(window, shows):
    assert (window.loading, window.shows) == (WindowLoading.COMPONENT, shows)


@pytest.mark.parametrize("window, reads", [(FileFeedWindow, ("file-edit list", "file-edit show")), (FileEditsWindow, ("file-edit list", "file-edit show", "agent list")),
                                           (TerminalWindow, ("agent terminal",))])
def test_a_coding_page_window_declares_the_reads_it_needs(window, reads):
    assert set(reads) <= set(window.reads)
