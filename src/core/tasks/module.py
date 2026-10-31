from core.base.module.module import Module
from core.base.module.noun import Noun
from core.base.registry.dotted_path import DottedPath
from core.tasks.task import Task
from core.tasks.task_dependency import TaskDependency
from core.tasks.task_log import TaskLog

TASK_COMMANDS = tuple(f"core.tasks.commands:{name}" for name in ("TaskPause", "TaskBlock", "TaskClose", "TaskCancel"))


class TasksModule(Module):
    """Adds tasks, units of work held by an agent, with their log lines and dependencies."""

    name = "tasks"
    requires_core = ">=5,<6"
    dependencies = ("actors", "environments", "agents")
    nouns = (Noun(Task, query=DottedPath("core.tasks.task_query:TaskQuery"), commands=TASK_COMMANDS), Noun(TaskLog), Noun(TaskDependency))
    migrations = ("core.tasks.migrations.m001_tasks:TasksTables",)
    subcommands = ("core.tasks.task_log_subcommand:TaskLogSubcommand", "core.tasks.dependency_subcommands:TaskDependSubcommand",
                   "core.tasks.dependency_subcommands:TaskUndependSubcommand")
    handlers = ("core.tasks.task_undepend_handler:TaskUndependHandler",)
    guards = ("core.tasks.guards.no_dependency_loop:NoDependencyLoop",)
    listeners = ("core.tasks.listeners.forget_dependencies:ForgetDependencies",)
