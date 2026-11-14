from engine.viewer.window import Window
from core.modules.tasks.support.skeletons import TASKS_TASKS_SKELETON
from core.modules.tasks.support.task_searcher import TaskSearcher
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.viewer.choice_option import ChoiceOption
from engine.viewer.window_search import WindowSearch
from core.modules.tasks.windows.tasks.keys.board_key import BoardKey
from core.modules.tasks.windows.tasks.keys.tags_key import TagsKey
from core.modules.tasks.windows.tasks.keys.group_key import GroupKey
from core.modules.tasks.windows.tasks.keys.graph_key import GraphKey
from core.modules.tasks.windows.tasks.keys.places_key import PlacesKey
from core.modules.tasks.windows.tasks.keys.task_key import TaskKey


class TasksWindow(Window):
    """The Tasks window."""

    name = "tasks.tasks"
    title = "Tasks"
    entry = "tasks.js"
    loading = WindowLoading.COMPONENT
    skeleton = TASKS_TASKS_SKELETON
    search = WindowSearch(TaskSearcher, "Search the tasks")
    icon = WindowIcon.TASK
    reads = ["task board", "task tags", "task graph", "task list", "task show", "task inspect", "task comments", "link list", "plan place", "plan places", "plan board", "plan outline", "task-log list"]
    options = [ChoiceOption("rows", "Tasks per page", [("5", "5"), ("10", "10"), ("25", "25"), ("50", "50")], "10")]
    runs = ["task assign", "phase place", "task make", "task edit", "task tag", "task untag", "task delete", "task start", "task block", "task unblock", "task retest", "task close", "task cancel", "task reopen"]
    events = ["task.*", "task_tag.*", "task_wait.*", "task_log.*"]
    keys = [BoardKey, TagsKey, GroupKey, GraphKey, PlacesKey, TaskKey]
