from core.modules.tasks.blocked_work_rule import BlockedWorkRule
from core.modules.tasks.task_stop_rule import TaskStopRule
from core.modules.tasks.task_block import TaskBlock
from core.modules.tasks.task_cancel import TaskCancel
from core.modules.tasks.task_close import TaskClose
from core.modules.tasks.task_depend_subcommand import TaskDependSubcommand
from core.modules.tasks.task_dependency_removal_subcommand import TaskDependencyRemovalSubcommand
from core.modules.tasks.guards.dependencies_closed_guard import DependenciesClosedGuard
from core.modules.tasks.guards.no_dependency_loop_guard import NoDependencyLoopGuard
from core.modules.tasks.listeners.dependency_remover_listener import DependencyRemoverListener
from core.modules.tasks.unlogged_write_rule import UnloggedWriteRule
from core.modules.tasks.log_request_rule import LogRequestRule
from core.modules.tasks.migrations.m001_tasks import TasksTablesMigration
from core.modules.tasks.migrations.m002_paused_tasks_blocked import PausedTasksBlockedMigration
from core.modules.tasks.inactive_task_reminder_rule import InactiveTaskReminderRule
from core.modules.tasks.task_summary_line_rule import TaskSummaryLineRule
from core.modules.tasks.task_return_line_rule import TaskReturnLineRule
from core.modules.tasks.task_log_subcommand import TaskLogSubcommand
from core.modules.tasks.task_query import TaskQuery
from core.modules.tasks.task_dependency_removal_handler import TaskDependencyRemovalHandler
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading
from core.base.module.model_declaration import ModelDeclaration
from core.modules.tasks.open_dependency import OpenDependency
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
    migrations = [TasksTablesMigration, PausedTasksBlockedMigration]
    subcommands = (TaskLogSubcommand, TaskDependSubcommand,
                   TaskDependencyRemovalSubcommand)
    handlers = [TaskDependencyRemovalHandler]
    guards = [NoDependencyLoopGuard, DependenciesClosedGuard]
    views = [OpenDependency]
    listeners = [DependencyRemoverListener]
    driver_rules = [LogRequestRule, UnloggedWriteRule, TaskStopRule, BlockedWorkRule, TaskSummaryLineRule, TaskReturnLineRule, InactiveTaskReminderRule]
    windows = [WindowDeclaration("tasks.tasks", "Tasks", "tasks.js", WindowLoading.COMPONENT, reads=["task list", "task show", "task-log list"], events=["task.*"])]
