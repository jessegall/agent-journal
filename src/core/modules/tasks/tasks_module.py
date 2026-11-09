from core.modules.tasks.migrations.m022_assign_held_tasks import TaskHolderDelegationMigration
from core.modules.tasks.commands.record_task_read.record_task_read_handler import RecordTaskReadHandler
from core.modules.tasks.commands.edit_task.edit_task_subcommand import EditTaskSubcommand
from core.modules.tasks.guards.task_edit_access_guard import TaskEditAccessGuard
from core.modules.tasks.migrations.m017_block_waiting_tasks import BlockWaitingTasksMigration
from core.modules.tasks.migrations.m018_task_log_important import TaskLogImportantMigration
from core.modules.tasks.migrations.m019_task_complexity import TaskComplexityMigration
from core.modules.tasks.migrations.m020_task_tags import TaskTagsMigration
from core.modules.tasks.migrations.m021_task_environment_id_index import TaskEnvironmentIdIndexMigration
from core.modules.tasks.models.task_tag import TaskTag
from core.modules.tasks.models.task_tag_word import TaskTagWord
from core.modules.tasks.commands.tag_task.tag_task_handler import TagTaskHandler
from core.modules.tasks.commands.tag_task.tag_task_subcommand import TagTaskSubcommand
from core.modules.tasks.commands.remove_task_tag.remove_task_tag_handler import RemoveTaskTagHandler
from core.modules.tasks.commands.remove_task_tag.remove_task_tag_subcommand import RemoveTaskTagSubcommand
from core.modules.tasks.commands.task_tags.task_tags_subcommand import TaskTagsSubcommand
from core.modules.tasks.commands.task_list.task_list_subcommand import TaskListSubcommand
from core.modules.tasks.guards.task_tag_access_guard import TaskTagAccessGuard
from core.modules.tasks.guards.task_tag_word_guard import TaskTagWordGuard
from core.modules.tasks.listeners.task_tag_remover_listener import TaskTagRemoverListener
from core.modules.tasks.migrations.m015_task_read_session import TaskReadSessionMigration
from core.modules.tasks.models.task_block_renewal import TaskBlockRenewal
from core.modules.tasks.models.task_block_review import TaskBlockReview
from core.modules.tasks.migrations.m011_task_block_renewals import TaskBlockRenewalsMigration
from core.modules.tasks.listeners.task_block_renewal_listener import TaskBlockRenewalListener
from core.modules.tasks.support.block_conditions.task_blocks_reviewed import TaskBlocksReviewed
from core.base.skill.skill_declaration import SkillDeclaration
from core.modules.tasks.support.task_nudges import TASK_NUDGES
from core.modules.tasks.rules.task_return_reminder_rule import TaskReturnReminderRule
from core.modules.tasks.rules.blocked_work_rule import BlockedWorkRule
from core.modules.tasks.rules.task_stop_rule import TaskStopRule
from core.modules.tasks.commands.assign_task.assign_task_handler import AssignTaskHandler
from core.modules.tasks.commands.assign_task.assign_task_subcommand import AssignTaskSubcommand
from core.modules.tasks.commands.block_task.block_task import BlockTask
from core.modules.tasks.commands.environment_cards.environment_cards_subcommand import EnvironmentCardsSubcommand
from core.modules.tasks.commands.task_graph.task_graph_subcommand import TaskGraphSubcommand
from core.modules.tasks.models.environment_card import EnvironmentCard
from core.modules.tasks.commands.wait_task.wait_task_handler import WaitTaskHandler
from core.modules.tasks.models.task_edge import TaskEdge
from core.modules.tasks.models.task_inspection_row import TaskInspectionRow
from core.modules.tasks.commands.wait_task.wait_task_subcommand import WaitTaskSubcommand
from core.modules.tasks.listeners.auto_next_task_listener import AutoNextTaskListener
from core.modules.tasks.listeners.task_dependency_wait_listener import TaskDependencyWaitListener
from core.modules.tasks.listeners.task_wait_listener import TaskWaitListener
from core.modules.tasks.listeners.waiting_task_listener import WaitingTaskListener
from core.modules.tasks.listeners.task_rows_listener import TaskRowsListener
from core.modules.tasks.migrations.m004_task_waits import TaskWaitsTableMigration
from core.modules.tasks.migrations.m005_task_priority_number import TaskPriorityNumberMigration
from core.modules.tasks.migrations.m006_task_started_at import TaskStartTimeMigration
from core.modules.tasks.migrations.m007_task_delegated_to import TaskDelegationMigration
from core.modules.tasks.migrations.m008_delegated_task_index import DelegatedTaskIndexMigration
from core.modules.tasks.migrations.m009_task_reads import TaskReadsTableMigration
from core.modules.tasks.migrations.m010_closed_task_index import ClosedTaskIndexMigration
from core.modules.tasks.migrations.m012_open_task_edge_index import OpenTaskEdgeIndexMigration
from core.modules.tasks.migrations.m013_task_closed_cursor_index import TaskClosedCursorIndexMigration
from core.modules.tasks.migrations.m014_pending_waits_index import PendingWaitsIndexMigration
from core.modules.tasks.models.task_read import TaskRead
from core.modules.tasks.commands.read_task_brief.read_task_brief_handler import ReadTaskBriefHandler
from core.modules.tasks.commands.read_task_brief.read_task_brief_subcommand import ReadTaskBriefSubcommand
from core.modules.tasks.commands.reset_task_reads.reset_task_reads_handler import ResetTaskReadsHandler
from core.modules.tasks.listeners.task_brief_assigned_listener import TaskBriefAssignedListener
from core.modules.tasks.listeners.task_brief_compaction_listener import TaskBriefCompactionListener
from core.modules.tasks.support.block_conditions.task_brief_read import TaskBriefRead
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.tasks.rules.task_name_rule import TaskNameRule
from core.modules.tasks.rules.unopenable_block_rule import UnopenableBlockRule
from core.modules.tasks.rules.wait_description_rule import WaitDescriptionRule
from core.modules.tasks.commands.task_board.task_board_subcommand import TaskBoardSubcommand
from core.modules.tasks.commands.task_counts.task_counts_subcommand import TaskCountsSubcommand
from core.modules.tasks.commands.task_inspect.task_inspect_subcommand import TaskInspectSubcommand
from core.modules.tasks.commands.task_info.task_info_subcommand import TaskInfoSubcommand
from core.modules.tasks.commands.cancel_task.cancel_task import CancelTask
from core.modules.tasks.commands.clear_delegated_tasks.clear_delegated_tasks_handler import ClearDelegatedTasksHandler
from core.modules.tasks.commands.release_task.release_task import ReleaseTask
from core.modules.tasks.commands.close_task.close_task import CloseTask
from core.modules.tasks.commands.make_task_dependency.make_task_dependency_subcommand import MakeTaskDependencySubcommand
from core.modules.tasks.commands.remove_task_dependency.remove_task_dependency_subcommand import RemoveTaskDependencySubcommand
from core.modules.tasks.commands.record_task_independence.record_task_independence_subcommand import RecordTaskIndependenceSubcommand
from core.modules.tasks.guards.dependencies_closed_guard import DependenciesClosedGuard
from core.modules.tasks.guards.visible_dependency_guard import VisibleDependencyGuard
from core.modules.tasks.guards.no_dependency_loop_guard import NoDependencyLoopGuard
from core.modules.tasks.guards.user_wait_guard import UserWaitGuard
from core.modules.tasks.guards.reserved_task_guard import ReservedTaskGuard
from core.modules.tasks.listeners.dependency_remover_listener import DependencyRemoverListener
from core.modules.tasks.rules.unlogged_write_rule import UnloggedWriteRule
from core.modules.tasks.rules.log_request_rule import LogRequestRule
from core.modules.tasks.migrations.m001_tasks import TasksTablesMigration
from core.modules.tasks.migrations.m002_paused_tasks_blocked import PausedTasksBlockedMigration
from core.modules.tasks.migrations.m003_task_state_index import TaskStateIndexMigration
from core.modules.tasks.migrations.m016_all_environments_task_state_index import AllEnvironmentsTaskStateIndexMigration
from core.modules.tasks.models.task_card import TaskCard
from core.modules.tasks.rules.inactive_task_reminder_rule import InactiveTaskReminderRule
from core.modules.tasks.rules.task_summary_line_rule import TaskSummaryLineRule
from core.modules.tasks.rules.task_filed_rule import TaskFiledRule
from core.modules.tasks.rules.task_start_rule import TaskStartRule
from core.modules.tasks.rules.task_return_line_rule import TaskReturnLineRule
from core.modules.tasks.commands.make_task_log.make_task_log_subcommand import MakeTaskLogSubcommand
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.upgrade.tasks_move import TasksMove
from core.modules.tasks.commands.remove_task_dependency.remove_task_dependency_handler import RemoveTaskDependencyHandler
from core.modules.tasks.commands.record_task_independence.record_task_independence_handler import RecordTaskIndependenceHandler
from core.modules.tasks.migrations.m023_task_independence_reason import TaskIndependenceReasonMigration
from core.base.module.module import Module
from core.base.viewer.window_search import WindowSearch
from core.modules.tasks.support.task_searcher import TaskSearcher
from core.base.viewer.choice_option import ChoiceOption
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_key import WindowKey
from core.base.viewer.key_loading import KeyLoading
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_place import WindowPlace
from core.modules.tasks.support.task_inspector import TASK_INSPECTOR
from core.base.viewer.skeleton_part import SkeletonPart
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
from core.modules.tasks.support.task_counts import TASK_COUNT_PERIODS
from core.modules.tasks.support.block_conditions.task_stopped import TaskStopped
from core.modules.tasks.support.skeletons import TASKS_TASKS_SKELETON
from core.modules.tasks.support.task_settings import TASK_SETTINGS

TASK_COMMANDS = (BlockTask, CloseTask, CancelTask, ReleaseTask)


class TasksModule(Module):
    """Adds tasks, units of work current by an agent, with their log lines and dependencies, and the rules
    that keep an agent at its task."""

    name = "journal.core.tasks"
    nudges = TASK_NUDGES
    settings = TASK_SETTINGS
    requires_core = ">=5,<6"
    block_conditions = [TaskStopped, TaskStarted, TaskClosed, StartedTaskExists, TaskLogged, TaskBriefRead, TaskBlocksReviewed]
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.chat", "journal.core.docking"]
    skills = [SkillDeclaration("journal-tasks", "Declare, log and finish the current work; read it before the first task command of a session", keywords=("task", "tasks", "todo"), commands=["task"])]
    models = [ModelDeclaration(Task, query=TaskQuery, commands=TASK_COMMANDS, excluded_subcommands=["block"]), ModelDeclaration(TaskTag, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(TaskLog), ModelDeclaration(TaskDependency), ModelDeclaration(TaskWait, excluded_subcommands=["make", "edit", "delete"]),
              ModelDeclaration(TaskBlockRenewal, excluded_subcommands=["make", "edit", "delete"]), ModelDeclaration(TaskRead, excluded_subcommands=["make", "edit", "show", "list", "delete"])]
    migrations = [TaskHolderDelegationMigration, BlockWaitingTasksMigration, TaskLogImportantMigration, TaskReadSessionMigration, PendingWaitsIndexMigration, OpenTaskEdgeIndexMigration, ClosedTaskIndexMigration, TasksTablesMigration, PausedTasksBlockedMigration, TaskStateIndexMigration, TaskWaitsTableMigration, TaskPriorityNumberMigration, TaskStartTimeMigration, TaskDelegationMigration, DelegatedTaskIndexMigration, TaskReadsTableMigration, TaskBlockRenewalsMigration, TaskClosedCursorIndexMigration, AllEnvironmentsTaskStateIndexMigration, TaskComplexityMigration, TaskTagsMigration, TaskEnvironmentIdIndexMigration, TaskIndependenceReasonMigration]
    subcommands = [TagTaskSubcommand, RemoveTaskTagSubcommand, TaskTagsSubcommand, TaskListSubcommand, EditTaskSubcommand, AssignTaskSubcommand, CommentTaskSubcommand, TaskCommentsSubcommand, EnvironmentCardsSubcommand, TaskGraphSubcommand, WaitTaskSubcommand, TaskBoardSubcommand, TaskCountsSubcommand, TaskInspectSubcommand, TaskInfoSubcommand, MakeTaskLogSubcommand, ReadTaskBriefSubcommand, MakeTaskDependencySubcommand,
                   RemoveTaskDependencySubcommand, RecordTaskIndependenceSubcommand]
    handlers = [RecordTaskIndependenceHandler, TagTaskHandler, RemoveTaskTagHandler, RecordTaskReadHandler, AssignTaskHandler, ClearDelegatedTasksHandler, ReadTaskBriefHandler, RemoveTaskDependencyHandler, ResetTaskReadsHandler, WaitTaskHandler]
    moves = [TasksMove]
    guards = [TaskTagAccessGuard, TaskTagWordGuard, TaskEditAccessGuard, VisibleDependencyGuard, NoDependencyLoopGuard, DependenciesClosedGuard, UserWaitGuard, ReservedTaskGuard]
    views = [TaskTagWord, OpenDependency, TaskCard, TaskEdge, EnvironmentCard, TaskInspectionRow, TaskBlockReview]
    listeners = [TaskTagRemoverListener, TaskDependencyWaitListener, WaitingTaskListener, TaskRowsListener, TaskBlockRenewalListener, DependencyRemoverListener, TaskEditedMarkListener, TaskMoveMarkListener, TaskWaitListener, TaskBriefAssignedListener, TaskBriefCompactionListener, AutoNextTaskListener]
    marks = TASK_MARKS
    docks = TASK_DOCKS
    driver_rules = [TaskFiledRule, TaskStartRule, TaskReturnReminderRule, WaitDescriptionRule, TaskNameRule, UnopenableBlockRule, LogRequestRule, UnloggedWriteRule, TaskStopRule, BlockedWorkRule, TaskSummaryLineRule, TaskReturnLineRule, InactiveTaskReminderRule]
    windows = [WindowDeclaration("tasks.tasks", "Tasks", "tasks.js", WindowLoading.COMPONENT, skeleton=TASKS_TASKS_SKELETON, search=WindowSearch(TaskSearcher, "Search the tasks"), icon=WindowIcon.TASK, reads=["task board", "task tags", "task graph", "task list", "task show", "task inspect", "task comments", "link list", "plan place", "plan places", "plan board", "plan outline", "task-log list"],
                               options=[ChoiceOption("rows", "Tasks per page", [("5", "5"), ("10", "10"), ("25", "25"), ("50", "50")], "10")],
              runs=["task assign", "phase place", "task make", "task edit", "task tag", "task untag", "task delete", "task start", "task block", "task unblock", "task retest", "task close", "task cancel", "task reopen"], events=["task.*", "task_tag.*", "task_wait.*", "task_log.*"],
              keys=[WindowKey("board", "task board", tab="list", arguments=["limit", "tag", "hide-plan-tasks"], events=["task.*", "task_tag.*", "task_wait.*"]),
                    WindowKey("tags", "task tags", tab="list", events=["task_tag.*"]),
                    WindowKey("group", "task board", arguments=["state", "limit", "before-id", "before-closed-at", "tag", "hide-plan-tasks"], loading=KeyLoading.REQUESTED),
                    WindowKey("graph", "task graph", tab="graph", events=["task.*"]),
                    WindowKey("places", "plan places", loading=KeyLoading.REQUESTED),
                    WindowKey("task.*", "task show {id}", loading=KeyLoading.REQUESTED)]),
               WindowDeclaration("tasks.task-details", "Details", "task-details.js", WindowLoading.COMPONENT, place=WindowPlace.SECTION, icon=WindowIcon.TASK, skeleton=[SkeletonPart.line()],
                                 reads=["plan place"], runs=["task edit"]),
               WindowDeclaration("tasks.task-chain", "What waits on what", "task-chain.js", WindowLoading.COMPONENT, place=WindowPlace.SECTION, icon=WindowIcon.TASK, skeleton=[SkeletonPart.line()],
                                 reads=["task graph"], events=["task.*"], keys=[WindowKey("graph", "task graph", events=["task.*"])]),
               WindowDeclaration("tasks.task-counts", "Task counts", "task-counts.js", WindowLoading.COMPONENT, icon=WindowIcon.TASK, skeleton=[SkeletonPart.line()],
                                 options=[ChoiceOption("columns", "Columns", [("auto", "Auto"), ("1", "1"), ("2", "2"), ("4", "4")], "auto"),
                                          ChoiceOption("completed", "Completed in", TASK_COUNT_PERIODS, "today")],
                                 reads=["task counts"], events=["task.*"], keys=[WindowKey("counts", "task counts", arguments=["hours", "since"], events=["task.*"])]),
               WindowDeclaration("tasks.task-log", "Log", "task-log.js", WindowLoading.COMPONENT, place=WindowPlace.SECTION, icon=WindowIcon.TASK, skeleton=[SkeletonPart.line()],
                                 reads=["task-log list"], events=["task_log.*"])]
    inspectors = [TASK_INSPECTOR]
    seeders = [TasksSeeder]
