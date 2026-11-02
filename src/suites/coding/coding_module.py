from suites.coding.support.coding_nudges import CODING_NUDGES
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.choice_option import ChoiceOption
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from suites.coding.drivers.builder.builder_driver import BuilderDriver
from suites.coding.coding_suite import CodingSuite
from suites.coding.models.file_edit import FileEdit
from suites.coding.upgrade.file_edits_move import FileEditsMove
from suites.coding.commands.record_file_edit.record_file_edit_handler import RecordFileEditHandler
from suites.coding.migrations.m001_file_edits import FileEditsTableMigration
from suites.coding.migrations.m002_file_edit_rows import FileEditRowsMigration
from suites.coding.drivers.orchestrator.orchestrator_driver import OrchestratorDriver
from suites.coding.drivers.orchestrator.guards.orchestrator_start_guard import OrchestratorStartGuard
from suites.coding.commands.project_file_find.project_file_find_subcommand import ProjectFileFindSubcommand
from suites.coding.commands.git_overview_branches.git_overview_branches_subcommand import GitOverviewBranchesSubcommand
from suites.coding.commands.git_overview_commits.git_overview_commits_subcommand import GitOverviewCommitsSubcommand
from suites.coding.commands.git_overview_current.git_overview_current_subcommand import GitOverviewCurrentSubcommand
from suites.coding.commands.git_overview_pulls.git_overview_pulls_subcommand import GitOverviewPullsSubcommand
from suites.coding.commands.project_file_list.project_file_list_subcommand import ProjectFileListSubcommand
from suites.coding.commands.project_file_show.project_file_show_subcommand import ProjectFileShowSubcommand
from suites.coding.rules.record_file_edit_rule import RecordFileEditRule
from suites.coding.rules.introduction_rule import IntroductionRule
from suites.coding.rules.waiting_items_rule import WaitingItemsRule
from suites.coding.drivers.subagent.subagent_driver import SubagentDriver
from suites.coding.drivers.worker.worker_driver import WorkerDriver
from suites.coding.support.coding_settings import CODING_SETTINGS
from suites.coding.listeners.auto_next_task_listener import AutoNextTaskListener

FILE_EDIT_READS = ["file-edit list", "file-edit show", "project-file show"]


class CodingModule(Module):
    """Ships the coding suite with its drivers, the record of every file a coding agent edits, and its windows; the
    modules only coding uses live in its modules folder."""

    name = "journal.suites.coding"
    nudges = CODING_NUDGES
    seed_reason = "its file edits are written by an agent's edit hooks, and the demo has no hooks"
    requires_core = ">=5,<6"
    settings = CODING_SETTINGS
    moves = [FileEditsMove]
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.tasks", "journal.core.plans", "journal.core.settings"]
    guards = [OrchestratorStartGuard]
    suites = [CodingSuite]
    drivers = [BuilderDriver, OrchestratorDriver, SubagentDriver, WorkerDriver]
    models = [ModelDeclaration(FileEdit, excluded_subcommands=["make", "edit"])]
    migrations = [FileEditsTableMigration, FileEditRowsMigration]
    handlers = [RecordFileEditHandler]
    driver_rules = [RecordFileEditRule, WaitingItemsRule, IntroductionRule]
    listeners = [AutoNextTaskListener]
    subcommands = [GitOverviewCurrentSubcommand, GitOverviewBranchesSubcommand, GitOverviewCommitsSubcommand, GitOverviewPullsSubcommand, ProjectFileListSubcommand, ProjectFileFindSubcommand, ProjectFileShowSubcommand]
    windows = [WindowDeclaration("coding.git", "Git", "git.js", WindowLoading.COMPONENT, place=WindowPlace.PAGE, group="project", icon=WindowIcon.BRANCH, reads=["git-overview branches", "git-overview commits", "git-overview pulls"]),
               WindowDeclaration("coding.files", "Files", "files.js", WindowLoading.COMPONENT, place=WindowPlace.PAGE, group="project", icon=WindowIcon.FILE, reads=["project-file list", "project-file find", "project-file show"]),
               WindowDeclaration("coding.work-mode", "Work mode", "work-mode.js", WindowLoading.COMPONENT, icon=WindowIcon.WINDOW, place=WindowPlace.HEADER,
                                 reads=["suite current", "setting show", "usage bars"], runs=["driver choose", "setting set"]),
               WindowDeclaration("coding.file-feed", "File feed", "file-feed.js", WindowLoading.COMPONENT, icon=WindowIcon.FILE, place=WindowPlace.AGENT, reads=FILE_EDIT_READS,
                                 events=["file_edit.create"]),
               WindowDeclaration("coding.file-edits", "File edits", "file-edits.js", WindowLoading.COMPONENT, icon=WindowIcon.COMMIT, reads=[*FILE_EDIT_READS, "agent list"],
                                 events=["file_edit.create"]),
               WindowDeclaration("coding.terminal", "Terminal", "terminal.js", WindowLoading.COMPONENT, icon=WindowIcon.TERMINAL, place=WindowPlace.AGENT,
                                 reads=["agent terminal", "hook-call feed"], runs=["agent type"], events=["hook_call.create"],
                                 options=[ChoiceOption("verbosity", "Detail level", [("commands", "Commands"), ("journal", "Commands and journal"), ("everything", "Show everything")], "journal")])]
