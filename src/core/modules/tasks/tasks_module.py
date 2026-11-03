from core.base.skill.skill_declaration import SkillDeclaration
from core.modules.tasks.support.task_nudges import TASK_NUDGES
from core.modules.tasks.rules.task_return_reminder_rule import TaskReturnReminderRule
from core.modules.tasks.rules.blocked_work_rule import BlockedWorkRule
from core.modules.tasks.rules.task_stop_rule import TaskStopRule
from core.modules.tasks.commands.block_task.block_task import BlockTask
from core.modules.tasks.commands.environment_cards.environment_cards_subcommand import EnvironmentCardsSubcommand
from core.modules.tasks.commands.task_graph.task_graph_subcommand import TaskGraphSubcommand
from core.modules.tasks.models.environment_card import EnvironmentCard
from core.modules.tasks.commands.wait_task.wait_task_handler import WaitTaskHandler
from core.modules.tasks.models.task_edge import TaskEdge
from core.modules.tasks.models.task_inspection_row import TaskInspectionRow
from core.modules.tasks.commands.wait_task.wait_task_subcommand import WaitTaskSubcommand
from core.modules.tasks.listeners.task_wait_listener import TaskWaitListener
from core.modules.tasks.migrations.m004_task_waits import TaskWaitsTableMigration
from core.modules.tasks.migrations.m005_task_priority_number import TaskPriorityNumberMigration
from core.modules.tasks.migrations.m006_task_started_at import TaskStartTimeMigration
from core.modules.tasks.migrations.m007_task_delegated_to import TaskDelegationMigration
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.tasks.rules.task_name_rule import TaskNameRule
from core.modules.tasks.rules.unopenable_block_rule import UnopenableBlockRule
from core.modules.tasks.rules.wait_description_rule import WaitDescriptionRule
from core.modules.tasks.commands.task_board.task_board_subcommand import TaskBoardSubcommand
from core.modules.tasks.commands.task_inspect.task_inspect_subcommand import TaskInspectSubcommand
from core.modules.tasks.commands.cancel_task.cancel_task import CancelTask
from core.modules.tasks.commands.clear_delegated_tasks.clear_delegated_tasks_handler import ClearDelegatedTasksHandler
from core.modules.tasks.commands.release_task.release_task import ReleaseTask
from core.modules.tasks.commands.close_task.close_task import CloseTask
from core.modules.tasks.commands.make_task_dependency.make_task_dependency_subcommand import MakeTaskDependencySubcommand
from core.modules.tasks.commands.remove_task_dependency.remove_task_dependency_subcommand import RemoveTaskDependencySubcommand
from core.modules.tasks.guards.dependencies_closed_guard import DependenciesClosedGuard
from core.modules.tasks.guards.no_dependency_loop_guard import NoDependencyLoopGuard
from core.modules.tasks.listeners.dependency_remover_listener import DependencyRemoverListener
from core.modules.tasks.rules.unlogged_write_rule import UnloggedWriteRule
from core.modules.tasks.listeners.full_test_run_listener import FullTestRunListener
from core.modules.tasks.rules.log_request_rule import LogRequestRule
from core.modules.tasks.migrations.m001_tasks import TasksTablesMigration
from core.modules.tasks.migrations.m002_paused_tasks_blocked import PausedTasksBlockedMigration
from core.modules.tasks.migrations.m003_task_state_index import TaskStateIndexMigration
from core.modules.tasks.models.task_card import TaskCard
from core.modules.tasks.rules.inactive_task_reminder_rule import InactiveTaskReminderRule
from core.modules.tasks.rules.task_summary_line_rule import TaskSummaryLineRule
from core.modules.tasks.rules.task_filed_rule import TaskFiledRule
from core.modules.tasks.rules.task_return_line_rule import TaskReturnLineRule
from core.modules.tasks.commands.make_task_log.make_task_log_subcommand import MakeTaskLogSubcommand
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.upgrade.tasks_move import TasksMove
from core.modules.tasks.commands.remove_task_dependency.remove_task_dependency_handler import RemoveTaskDependencyHandler
from core.base.module.module import Module
from core.base.viewer.choice_option import ChoiceOption
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.module.model_declaration import ModelDeclaration
from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.commands.comment_task.comment_task_subcommand import CommentTaskSubcommand
from core.modules.tasks.commands.task_comments.task_comments_subcommand import TaskCommentsSubcommand
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_dependency import TaskDependency
from core.modules.tasks.models.task_log import TaskLog
from core.modules.tasks.listeners.task_edited_mark_listener import TaskEditedMarkListener
from core.modules.tasks.listeners.task_move_mark_listener import TaskMoveMarkListener
from core.modules.tasks.support.task_marks import TASK_DOCKS, TASK_MARKS
from core.modules.tasks.seeders.tasks_seeder import TasksSeeder
from core.modules.tasks.support.block_conditions.task_started import TaskStarted
from core.modules.tasks.support.block_conditions.task_closed import TaskClosed
from core.modules.tasks.support.block_conditions.started_task_exists import StartedTaskExists
from core.modules.tasks.support.block_conditions.task_logged import TaskLogged
from core.modules.tasks.support.block_conditions.task_stopped import TaskStopped

TASK_COMMANDS = (BlockTask, CloseTask, CancelTask, ReleaseTask)


class TasksModule(Module):
    """Adds tasks, units of work current by an agent, with their log lines and dependencies, and the rules
    that keep an agent at its task."""

    name = "journal.core.tasks"
    nudges = TASK_NUDGES
    requires_core = ">=5,<6"
    block_conditions = [TaskStopped, TaskStarted, TaskClosed, StartedTaskExists, TaskLogged]
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.chat", "journal.core.docking"]
    skills = [SkillDeclaration("journal-tasks", "Declare, log and finish the current work; read it before the first task command of a session", keywords=("task", "tasks", "todo"), commands=["task"])]
    models = (ModelDeclaration(Task, query=TaskQuery, commands=TASK_COMMANDS, excluded_subcommands=["block"]), ModelDeclaration(TaskLog), ModelDeclaration(TaskDependency), ModelDeclaration(TaskWait, excluded_subcommands=["make", "edit", "delete"]))
    migrations = [TasksTablesMigration, PausedTasksBlockedMigration, TaskStateIndexMigration, TaskWaitsTableMigration, TaskPriorityNumberMigration, TaskStartTimeMigration, TaskDelegationMigration]
    subcommands = (CommentTaskSubcommand, TaskCommentsSubcommand, EnvironmentCardsSubcommand, TaskGraphSubcommand, WaitTaskSubcommand, TaskBoardSubcommand, TaskInspectSubcommand, MakeTaskLogSubcommand, MakeTaskDependencySubcommand,
                   RemoveTaskDependencySubcommand)
    handlers = [ClearDelegatedTasksHandler, RemoveTaskDependencyHandler, WaitTaskHandler]
    moves = [TasksMove]
    guards = [NoDependencyLoopGuard, DependenciesClosedGuard]
    views = [OpenDependency, TaskCard, TaskEdge, EnvironmentCard, TaskInspectionRow]
    listeners = [FullTestRunListener, DependencyRemoverListener, TaskEditedMarkListener, TaskMoveMarkListener, TaskWaitListener]
    marks = TASK_MARKS
    docks = TASK_DOCKS
    driver_rules = [TaskFiledRule, TaskReturnReminderRule, WaitDescriptionRule, TaskNameRule, UnopenableBlockRule, LogRequestRule, UnloggedWriteRule, TaskStopRule, BlockedWorkRule, TaskSummaryLineRule, TaskReturnLineRule, InactiveTaskReminderRule]
    windows = [WindowDeclaration("tasks.tasks", "Tasks", "tasks.js", WindowLoading.COMPONENT, icon=WindowIcon.TASK, reads=["task board", "task graph", "task list", "task show", "task inspect", "plan place", "plan board", "plan outline", "task-log list"],
                               options=[ChoiceOption("rows", "Tasks per page", [("5", "5"), ("10", "10"), ("25", "25"), ("50", "50")], "10")],
                               runs=["phase place", "task make", "task edit", "task delete", "task start", "task block", "task unblock", "task retest", "task close", "task cancel", "task reopen"], events=["task.*"])]
    seeders = [TasksSeeder]
