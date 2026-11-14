from suites.coding.models.declarations.file_edit_model_declaration import FileEditModelDeclaration
from suites.coding.agent_groups.coding_agent_groups import CODING_AGENT_GROUPS
from suites.coding.skills.declarations.coding_skills import CODING_SKILLS
from suites.coding.windows.extensions.coding_window_extensions import CODING_WINDOW_EXTENSIONS
from suites.coding.migrations.m006_main_starts_helpers_key import MainStartsHelpersKeyMigration
from suites.coding.migrations.m007_read_only_helpers_key import HelpersKeyMigration
from suites.coding.migrations.m003_file_edit_session import FileEditSessionMigration
from suites.coding.migrations.m004_main_agent_settings import MainAgentSettingsMigration
from suites.coding.migrations.m005_main_driver import MainDriverMigration
from suites.coding.migrations.m009_prune_file_edits import PruneFileEditsMigration
from suites.coding.support.shipped_profiles import HELPER_PROFILES
from suites.coding.support.coding_nudges import CODING_NUDGES
from suites.coding.templates.coding_templates import CODING_TEMPLATES
from engine.module.module import Module
from suites.coding.upgrade.file_edits_move import FileEditsMove
from suites.coding.upgrade.viewer_layouts_move import ViewerLayoutsMove
from suites.coding.upgrade.coding_settings_move import CodingSettingsMove
from suites.coding.seeders.coding_seeder import CodingSeeder
from suites.coding.migrations.m008_read_only_helper_requests import HelperRequestKeysMigration
from suites.coding.commands.record_file_changes.record_file_changes_handler import RecordFileChangesHandler
from suites.coding.commands.record_file_changes.record_file_changes_subcommand import RecordFileChangesSubcommand
from suites.coding.commands.record_file_edit.record_file_edit_handler import RecordFileEditHandler
from suites.coding.commands.prune_file_edits.prune_file_edits_handler import PruneFileEditsHandler
from suites.coding.migrations.m001_file_edits import FileEditsTableMigration
from suites.coding.migrations.m002_file_edit_rows import FileEditRowsMigration
from suites.coding.commands.project_file_find.project_file_find_subcommand import ProjectFileFindSubcommand
from suites.coding.commands.project_file_grep.project_file_grep_subcommand import ProjectFileGrepSubcommand
from suites.coding.commands.git_overview_branches.git_overview_branches_subcommand import GitOverviewBranchesSubcommand
from suites.coding.commands.git_overview_commits.git_overview_commits_subcommand import GitOverviewCommitsSubcommand
from suites.coding.commands.git_overview_current.git_overview_current_subcommand import GitOverviewCurrentSubcommand
from suites.coding.commands.git_overview_pulls.git_overview_pulls_subcommand import GitOverviewPullsSubcommand
from suites.coding.commands.project_file_list.project_file_list_subcommand import ProjectFileListSubcommand
from suites.coding.commands.project_file_show.project_file_show_subcommand import ProjectFileShowSubcommand
from suites.coding.commands.file_edit_file.file_edit_file_subcommand import FileEditFileSubcommand
from suites.coding.rules.introduction_rule import IntroductionRule
from suites.coding.rules.waiting_items_rule import WaitingItemsRule
from suites.coding.drivers.helper.helper_driver import HelperDriver
from suites.coding.drivers.worker.worker_driver import WorkerDriver
from suites.coding.drivers.main.main_driver import MainDriver
from suites.coding.settings.coding_setting_values import CodingSettingValues
from suites.coding.listeners.full_test_run_listener import FullTestRunListener
from suites.coding.rules.failed_full_run_rule import FailedFullRunRule
from suites.coding.rules.graphify_search_rule import GraphifySearchRule
from suites.coding.listeners.graphify_hook_removal_listener import GraphifyHookRemovalListener
from suites.coding.support.graphify_nudges import TOOL_NUDGES
from suites.coding.settings.graphify_setting_values import GraphifySettingValues
from suites.coding.bindings.coding_tool_runners import CodingToolRunners
from suites.coding.migrations.m010_graphify_setting_keys import GraphifySettingKeysMigration
from suites.coding.migrations.m011_worker_profile_names import WorkerProfileNamesMigration
from suites.coding.migrations.m012_file_edit_old_path import FileEditOldPathMigration
from suites.coding.migrations.m013_file_edit_old_path_name import FileEditOldPathNameMigration
from core.modules.tools.support.tool_runners import ToolRunners
from suites.coding.support.full_run_nudges import TESTING_TASKS_FULL_RUN, TESTING_TASKS_FAILED_RUN
from suites.coding.windows.coding_windows import CODING_WINDOWS
from engine.checkout.project_checkouts import ProjectCheckouts
from suites.coding.support.worktree_checkouts import WorktreeCheckouts



class CodingModule(Module):
    """Ships the coding suite with its drivers, the record of every file a coding agent edits, and its
    windows; the modules only coding uses live in its modules folder."""

    name = "journal.suites.coding"
    profiles = HELPER_PROFILES
    agent_groups = CODING_AGENT_GROUPS
    templates = CODING_TEMPLATES
    nudges = [*CODING_NUDGES, TESTING_TASKS_FULL_RUN, TESTING_TASKS_FAILED_RUN, *TOOL_NUDGES]
    seeders = [CodingSeeder]
    window_extensions = CODING_WINDOW_EXTENSIONS
    requires_engine = ">=5,<6"
    settings = [CodingSettingValues, GraphifySettingValues]
    moves = [FileEditsMove, ViewerLayoutsMove, CodingSettingsMove]
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.tasks", "journal.core.assignments", "journal.core.assign_rules", "journal.core.plans", "journal.core.settings", "journal.core.setting-requests", "journal.core.viewer", "journal.core.plugins", "journal.core.processes", "journal.core.messages", "journal.core.questions", "journal.core.helpers", "journal.core.tools"]
    drivers = [MainDriver, HelperDriver, WorkerDriver]
    skills = CODING_SKILLS
    models = [FileEditModelDeclaration]
    migrations = [FileEditOldPathMigration, FileEditOldPathNameMigration, WorkerProfileNamesMigration, HelperRequestKeysMigration, HelpersKeyMigration, MainStartsHelpersKeyMigration, FileEditSessionMigration, FileEditsTableMigration, FileEditRowsMigration, MainAgentSettingsMigration, MainDriverMigration, PruneFileEditsMigration, GraphifySettingKeysMigration]
    handlers = [RecordFileEditHandler, RecordFileChangesHandler, PruneFileEditsHandler]
    driver_rules = [WaitingItemsRule, IntroductionRule, FailedFullRunRule, GraphifySearchRule]
    listeners = [FullTestRunListener, GraphifyHookRemovalListener]
    bindings = {ToolRunners: CodingToolRunners, ProjectCheckouts: WorktreeCheckouts}
    subcommands = [GitOverviewCurrentSubcommand, GitOverviewBranchesSubcommand, GitOverviewCommitsSubcommand, GitOverviewPullsSubcommand, ProjectFileListSubcommand, ProjectFileFindSubcommand, ProjectFileGrepSubcommand, ProjectFileShowSubcommand, FileEditFileSubcommand, RecordFileChangesSubcommand]
    windows = CODING_WINDOWS
