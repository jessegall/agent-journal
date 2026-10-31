from core.modules.tasks.commands import TaskBlock, TaskCancel, TaskClose, TaskPause
from core.modules.tasks.dependency_subcommands import TaskDependSubcommand, TaskUndependSubcommand
from core.modules.tasks.guards.no_dependency_loop import NoDependencyLoop
from core.modules.tasks.listeners.forget_dependencies import ForgetDependencies
from core.modules.tasks.migrations.m001_tasks import TasksTables
from core.modules.tasks.task_log_subcommand import TaskLogSubcommand
from core.modules.tasks.task_query import TaskQuery
from core.modules.tasks.task_undepend_handler import TaskUndependHandler
from core.base.module.module import Module
from core.base.module.model_declaration import ModelDeclaration
from core.modules.tasks.task import Task
from core.modules.tasks.task_dependency import TaskDependency
from core.modules.tasks.task_log import TaskLog

TASK_COMMANDS = (TaskPause, TaskBlock, TaskClose, TaskCancel,)


class TasksModule(Module):
    """Adds tasks, units of work held by an agent, with their log lines and dependencies."""

    name = "journal.core.tasks"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents"]
    models = (ModelDeclaration(Task, query=TaskQuery, commands=TASK_COMMANDS), ModelDeclaration(TaskLog), ModelDeclaration(TaskDependency))
    migrations = [TasksTables]
    subcommands = (TaskLogSubcommand, TaskDependSubcommand,
                   TaskUndependSubcommand)
    handlers = [TaskUndependHandler]
    guards = [NoDependencyLoop]
    listeners = [ForgetDependencies]
