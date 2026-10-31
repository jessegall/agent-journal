from core.modules.tasks.blocked_work_refusal import BlockedWorkRefusal
from core.modules.tasks.carry_on_refusal import CarryOnRefusal
from core.modules.tasks.commands import TaskBlock, TaskCancel, TaskClose
from core.modules.tasks.dependency_subcommands import TaskDependSubcommand, TaskUndependSubcommand
from core.modules.tasks.guards.no_dependency_loop import NoDependencyLoop
from core.modules.tasks.listeners.forget_dependencies import ForgetDependencies
from core.modules.tasks.unlogged_write_limit import UnloggedWriteLimit
from core.modules.tasks.log_request import LogRequest
from core.modules.tasks.migrations.m001_tasks import TasksTables
from core.modules.tasks.migrations.m002_paused_tasks_blocked import PausedTasksBlocked
from core.modules.tasks.quiet_task_reminder import QuietTaskReminder
from core.modules.tasks.task_summary_line import TaskSummaryLine
from core.modules.tasks.where_you_stand import WhereYouStand
from core.modules.tasks.task_log_subcommand import TaskLogSubcommand
from core.modules.tasks.task_query import TaskQuery
from core.modules.tasks.task_undepend_handler import TaskUndependHandler
from core.base.module.module import Module
from core.base.module.model_declaration import ModelDeclaration
from core.modules.tasks.task import Task
from core.modules.tasks.task_dependency import TaskDependency
from core.modules.tasks.task_log import TaskLog

TASK_COMMANDS = (TaskBlock, TaskClose, TaskCancel)


class TasksModule(Module):
    """Adds tasks, units of work current by an agent, with their log lines and dependencies, and the rules that keep
    an agent at its task."""

    name = "journal.core.tasks"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers"]
    models = (ModelDeclaration(Task, query=TaskQuery, commands=TASK_COMMANDS), ModelDeclaration(TaskLog), ModelDeclaration(TaskDependency))
    migrations = [TasksTables, PausedTasksBlocked]
    subcommands = (TaskLogSubcommand, TaskDependSubcommand,
                   TaskUndependSubcommand)
    handlers = [TaskUndependHandler]
    guards = [NoDependencyLoop]
    listeners = [ForgetDependencies]
    driver_rules = [LogRequest, UnloggedWriteLimit, CarryOnRefusal, BlockedWorkRefusal, TaskSummaryLine, WhereYouStand, QuietTaskReminder]
