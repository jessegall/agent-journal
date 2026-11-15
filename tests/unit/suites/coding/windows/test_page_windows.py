import pytest

from engine.enums.window_place import WindowPlace
from suites.coding.coding_suite import CodingSuite
from suites.coding.windows.agent_settings.agent_settings_window import AgentSettingsWindow

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
def test_a_coding_page_window_declares_the_reads_it_states(window, reads):
    assert set(reads) <= set(window.reads)


def test_the_agent_settings_window_is_a_modal_and_no_page_the_suite_offers():
    assert AgentSettingsWindow.place is not WindowPlace.PAGE and AgentSettingsWindow.name not in CodingSuite.offered_windows()
