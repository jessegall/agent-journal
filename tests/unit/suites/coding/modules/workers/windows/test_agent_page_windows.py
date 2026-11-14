import pytest

from engine.enums.window_loading import WindowLoading
from engine.enums.window_shows import WindowShows
from suites.coding.modules.workers.windows.points.points_window import PointsWindow
from suites.coding.modules.workers.windows.todos.todos_window import TodosWindow


@pytest.mark.parametrize("window, read", [(PointsWindow, "worker-worktree points"), (TodosWindow, "todo-item list")])
def test_a_page_window_of_one_agent_is_a_component_that_declares_its_own_read(window, read):
    assert (window.loading, window.shows) == (WindowLoading.COMPONENT, WindowShows.SELECTED_AGENT)
    assert read in window.reads
