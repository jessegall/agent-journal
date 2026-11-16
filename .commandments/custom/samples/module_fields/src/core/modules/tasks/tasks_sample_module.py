from engine.module.module import Module
from core.modules.tasks.support.tasks_handlers import TASKS_HANDLERS
from core.modules.tasks.commands.make_task.make_task_handler import MakeTaskHandler
from core.modules.tasks.commands.edit_task.edit_task_handler import EditTaskHandler


class TasksSampleModule(Module):
    """Tasks, as a sample module."""

    name = "journal.core.tasks-sample"
    # @righteous architecture_modules_long_inline_field
    handlers = TASKS_HANDLERS
    # @sin architecture_modules_long_inline_field
    listeners = [MakeTaskHandler,
                 EditTaskHandler]
