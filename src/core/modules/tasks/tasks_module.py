from core.modules.tasks.rules.blocked_work_rule import BlockedWorkRule
from core.modules.tasks.rules.task_stop_rule import TaskStopRule
from core.modules.tasks.commands.block_task import BlockTask
from core.modules.tasks.commands.cancel_task import CancelTask
from core.modules.tasks.commands.close_task import CloseTask
from core.modules.tasks.commands.make_task_dependency_subcommand import MakeTaskDependencySubcommand
from core.modules.tasks.commands.remove_task_dependency_subcommand import RemoveTaskDependencySubcommand
from core.modules.tasks.guards.dependencies_closed_guard import DependenciesClosedGuard
from core.modules.tasks.guards.no_dependency_loop_guard import NoDependencyLoopGuard
from core.modules.tasks.listeners.dependency_remover_listener import DependencyRemoverListener
from core.modules.tasks.rules.unlogged_write_rule import UnloggedWriteRule
from core.modules.tasks.rules.log_request_rule import LogRequestRule
from core.modules.tasks.migrations.m001_tasks import TasksTablesMigration
from core.modules.tasks.migrations.m002_paused_tasks_blocked import PausedTasksBlockedMigration
from core.modules.tasks.rules.inactive_task_reminder_rule import InactiveTaskReminderRule
from core.modules.tasks.rules.task_summary_line_rule import TaskSummaryLineRule
from core.modules.tasks.rules.task_return_line_rule import TaskReturnLineRule
from core.modules.tasks.commands.make_task_log_subcommand import MakeTaskLogSubcommand
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.upgrade.tasks_move import TasksMove
from core.modules.tasks.commands.remove_task_dependency_handler import RemoveTaskDependencyHandler
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.module.model_declaration import ModelDeclaration
from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_dependency import TaskDependency
from core.modules.tasks.models.task_log import TaskLog
from core.modules.tasks.listeners.task_move_mark_listener import TaskMoveMarkListener
from core.modules.tasks.support.task_marks import TASK_DOCKS, TASK_MARKS
from core.modules.tasks.seeders.tasks_seeder import TasksSeeder

TASK_COMMANDS = (BlockTask, CloseTask, CancelTask)


class TasksModule(Module):
    """Adds tasks, units of work current by an agent, with their log lines and dependencies, and the rules
    that keep an agent at its task."""

    name = "journal.core.tasks"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.chat", "journal.core.docking"]
    models = (ModelDeclaration(Task, query=TaskQuery, commands=TASK_COMMANDS), ModelDeclaration(TaskLog), ModelDeclaration(TaskDependency))
    migrations = [TasksTablesMigration, PausedTasksBlockedMigration]
    subcommands = (MakeTaskLogSubcommand, MakeTaskDependencySubcommand,
                   RemoveTaskDependencySubcommand)
    handlers = [RemoveTaskDependencyHandler]
    moves = [TasksMove]
    guards = [NoDependencyLoopGuard, DependenciesClosedGuard]
    views = [OpenDependency]
    listeners = [DependencyRemoverListener, TaskMoveMarkListener]
    marks = TASK_MARKS
    docks = TASK_DOCKS
    driver_rules = [LogRequestRule, UnloggedWriteRule, TaskStopRule, BlockedWorkRule, TaskSummaryLineRule, TaskReturnLineRule, InactiveTaskReminderRule]
    windows = [WindowDeclaration("tasks.tasks", "Tasks", "tasks.js", WindowLoading.COMPONENT, icon=WindowIcon.TASK, reads=["task list", "task show", "task-log list"], events=["task.*"])]
    seeders = [TasksSeeder]
