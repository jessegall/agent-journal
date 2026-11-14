from engine.viewer.window import Window
from core.modules.tasks.support.task_counts import TASK_COUNT_PERIODS
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.viewer.choice_option import ChoiceOption
from engine.viewer.skeleton_part import SkeletonPart
from core.modules.tasks.windows.task_counts.keys.counts_key import CountsKey


class TaskCountsWindow(Window):
    """The Task counts window."""

    name = "tasks.task-counts"
    title = "Task counts"
    entry = "task-counts.js"
    loading = WindowLoading.COMPONENT
    icon = WindowIcon.TASK
    skeleton = [SkeletonPart.line()]
    options = [ChoiceOption("columns", "Columns", [("auto", "Auto"), ("1", "1"), ("2", "2"), ("4", "4")], "auto"),
                                          ChoiceOption("completed", "Completed in", TASK_COUNT_PERIODS, "today")]
    reads = ["task counts"]
    events = ["task.*"]
    keys = [CountsKey]
