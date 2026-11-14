from engine.viewer.window import Window
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.enums.window_shows import WindowShows
from suites.coding.modules.workers.support.skeletons import WORKERS_TODOS_SKELETON
from suites.coding.modules.workers.windows.todos.keys.todos_key import TodosKey


class TodosWindow(Window):
    """The Tasks window."""

    name = "workers.todos"
    title = "Tasks"
    entry = "todos.js"
    loading = WindowLoading.COMPONENT
    skeleton = WORKERS_TODOS_SKELETON
    icon = WindowIcon.TASK
    shows = WindowShows.SELECTED_AGENT
    reads = ["todo-item list"]
    events = ["todo_item.*"]
    keys = [TodosKey]
