from suites.coding.migrations.m006_main_starts_helpers_key import MainStartsHelpersKeyMigration
from suites.coding.migrations.m007_read_only_helpers_key import HelpersKeyMigration
from suites.coding.migrations.m003_file_edit_session import FileEditSessionMigration
from suites.coding.migrations.m004_main_agent_settings import MainAgentSettingsMigration
from suites.coding.migrations.m005_main_driver import MainDriverMigration
from suites.coding.migrations.m009_prune_file_edits import PruneFileEditsMigration
from suites.coding.support.shipped_profiles import HELPER_PROFILES
from core.base.viewer.window_read_search import WindowReadSearch
from core.base.viewer.window_extension import WindowExtension
from core.base.viewer.window_tab import WindowTab
from suites.coding.support.coding_nudges import CODING_NUDGES
from suites.coding.support.coding_templates import CODING_TEMPLATES
from engine.module.model_declaration import ModelDeclaration
from engine.skill.skill_declaration import SkillDeclaration
from engine.module.module import Module
from engine.agent.agent_group import AgentGroup
from engine.helper_type.helper_type import HelperType
from core.base.viewer.window_search import WindowSearch
from suites.coding.support.file_edit_searcher import FileEditSearcher
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_key import WindowKey
from core.base.viewer.key_loading import KeyLoading
from core.base.viewer.auto_scroll import AutoScroll
from core.base.viewer.choice_option import ChoiceOption
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.base.viewer.window_shows import WindowShows
from suites.coding.coding_suite import CodingSuite
from suites.coding.models.file_edit import FileEdit
from suites.coding.upgrade.file_edits_move import FileEditsMove
from suites.coding.upgrade.viewer_layouts_move import ViewerLayoutsMove
from suites.coding.upgrade.coding_settings_move import CodingSettingsMove
from suites.coding.seeders.coding_seeder import CodingSeeder
from suites.coding.migrations.m008_read_only_helper_requests import HelperRequestKeysMigration
from suites.coding.commands.record_file_changes.record_file_changes_handler import RecordFileChangesHandler
from suites.coding.commands.record_file_changes.record_file_changes_subcommand import RecordFileChangesSubcommand
from suites.coding.commands.record_file_edit.record_file_edit_handler import RecordFileEditHandler
from suites.coding.migrations.m001_file_edits import FileEditsTableMigration
from suites.coding.migrations.m002_file_edit_rows import FileEditRowsMigration
from suites.coding.commands.project_file_find.project_file_find_subcommand import ProjectFileFindSubcommand
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
from suites.coding.support.coding_settings import CODING_SETTINGS
from suites.coding.listeners.full_test_run_listener import FullTestRunListener
from suites.coding.support.test_run_nudges import TESTING_TASKS_FULL_RUN, TESTING_TASKS_FAILED_RUN
from suites.coding.support.skeletons import CODING_GIT_SKELETON, CODING_FILES_SKELETON, CODING_WORK_MODE_SKELETON, CODING_AGENT_SETTINGS_SKELETON, CODING_FILE_FEED_SKELETON, CODING_FILE_EDITS_SKELETON, CODING_TERMINAL_SKELETON

FILE_EDIT_READS = ["file-edit list", "file-edit show", "project-file show"]


class CodingModule(Module):
    """Ships the coding suite with its drivers, the record of every file a coding agent edits, and its
    windows; the modules only coding uses live in its modules folder."""

    name = "journal.suites.coding"
    profiles = HELPER_PROFILES
    helper_types = [HelperType("verifier", "Verifier")]
    agent_groups = [AgentGroup("workers", "Workers", "worker"), AgentGroup("merger", "Merger", "helper", tuple(["journal-merger"])),
                    AgentGroup("designer", "Designer", "helper", tuple(["journal-designer"])), AgentGroup("helpers", "Helpers", "helper")]
    templates = CODING_TEMPLATES
    nudges = [*CODING_NUDGES, TESTING_TASKS_FULL_RUN, TESTING_TASKS_FAILED_RUN]
    seeders = [CodingSeeder]
    window_extensions = [*(WindowExtension(name, reads=["file-edit list"], runs=["agent type"], events=["file_edit.create"],
                                          keys=[WindowKey("agent-edits.*", "file-edit list --agent {id}", arguments=["limit", "before-id", "after-id"], page_size=50),
                                                WindowKey("terminal-calls.*", "hook-call feed --session-agent-id {id}", arguments=["limit", "before-id", "after-id"], page_size=200)],
                                          tabs=[WindowTab("file-feed", "File feed", "file-edit list", component="/modules/journal.suites.coding/agent-file-edits.js"),
                                                WindowTab("terminal", "Terminal", "hook-call feed", component="/modules/journal.suites.coding/terminal.js")]) for name in ("agents.agents", "agents.helpers")),
                         WindowExtension("viewer.shell", reads=["git-overview current"], keys=[WindowKey("branch", "git-overview current", reload_seconds=30)]),
                         WindowExtension("plugins.plugins", links={"files": "coding.files"})]
    requires_core = ">=5,<6"
    settings = CODING_SETTINGS
    moves = [FileEditsMove, ViewerLayoutsMove, CodingSettingsMove]
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.drivers", "journal.core.tasks", "journal.core.plans", "journal.core.settings", "journal.core.setting-requests", "journal.core.viewer", "journal.core.plugins", "journal.core.processes", "journal.core.messages", "journal.core.questions", "journal.core.helpers"]
    suites = [CodingSuite]
    drivers = [MainDriver, HelperDriver, WorkerDriver]
    skills = [SkillDeclaration("journal-plan-dispatch", "Send a functional designer and then a planner to make the plan; read it when the user asks for a plan", keywords=("plan", "roadmap"), types=["main"]),
              SkillDeclaration("journal-functional-design", "Write a functional design of user stories, code examples and the phases in order; read it before you write one"),
              SkillDeclaration("journal-user-stories", "Write user stories for any system design from every angle, and group them into story books; read it before you write stories or a functional design", keywords=("user story", "user stories", "story book")),
              SkillDeclaration("journal-work-modes", "Work as the main agent of the coding suite from its work controls; read it when auto mode, the presets, read-only helpers or the worker limit come up", keywords=("builder", "orchestrator", "auto mode", "work mode"), types=["main"])]
    models = [ModelDeclaration(FileEdit, excluded_subcommands=["make", "edit"])]
    migrations = [HelperRequestKeysMigration, HelpersKeyMigration, MainStartsHelpersKeyMigration, FileEditSessionMigration, FileEditsTableMigration, FileEditRowsMigration, MainAgentSettingsMigration, MainDriverMigration, PruneFileEditsMigration]
    handlers = [RecordFileEditHandler, RecordFileChangesHandler]
    driver_rules = [WaitingItemsRule, IntroductionRule]
    listeners = [FullTestRunListener]
    subcommands = [GitOverviewCurrentSubcommand, GitOverviewBranchesSubcommand, GitOverviewCommitsSubcommand, GitOverviewPullsSubcommand, ProjectFileListSubcommand, ProjectFileFindSubcommand, ProjectFileShowSubcommand, FileEditFileSubcommand, RecordFileChangesSubcommand]
    windows = [WindowDeclaration("coding.git", "Git", "git.js", WindowLoading.COMPONENT, skeleton=CODING_GIT_SKELETON, place=WindowPlace.PAGE, group="project", icon=WindowIcon.BRANCH, reads=["git-overview branches", "git-overview commits", "git-overview pulls"],
                                 keys=[WindowKey("branches", "git-overview branches", arguments=["skip", "limit"]),
                                       WindowKey("commits", "git-overview commits", arguments=["skip", "limit"]),
                                       WindowKey("pulls", "git-overview pulls")]),
               WindowDeclaration("coding.files", "Files", "files.js", WindowLoading.COMPONENT, skeleton=CODING_FILES_SKELETON, place=WindowPlace.PAGE, group="project", icon=WindowIcon.FILE, reads=["project-file list", "project-file find", "project-file show"], search=WindowReadSearch("project-file find", "Find a file in the project"),
                                 keys=[WindowKey("entries", "project-file list {folder}"),
                                       WindowKey("matches", "project-file find {words}", loading=KeyLoading.REQUESTED),
                                       WindowKey("file", "project-file show {path}", loading=KeyLoading.REQUESTED)]),
               WindowDeclaration("coding.work-mode", "Work mode", "work-mode.js", WindowLoading.COMPONENT, skeleton=CODING_WORK_MODE_SKELETON, icon=WindowIcon.WINDOW, place=WindowPlace.HEADER,
                                 reads=["work-settings show", "setting show", "agent limits"], runs=["work-settings preset", "work-settings apply", "setting set"], events=["setting.*", "agent.*"],
                                 keys=[WindowKey("work", "work-settings show", events=["setting.*"]),
                                       WindowKey("auto", "setting show journal.suites.coding.auto-mode", events=["setting.*"]),
                                       WindowKey("limits", "agent limits", tab="agents", events=["agent.*", "setting.*"])]),
               WindowDeclaration("coding.agent-settings", "Agent settings", "agent-settings.js", WindowLoading.COMPONENT, skeleton=CODING_AGENT_SETTINGS_SKELETON, icon=WindowIcon.WINDOW,
                                 reads=["work-settings show", "agent limits", "agent cards", "setting show"], runs=["work-settings apply", "work-settings preset", "setting set", "agent profile-limits", "agent retire"],
                                 events=["setting.*", "agent.*"],
                                 keys=[WindowKey("work", "work-settings show", events=["setting.*"]),
                                       WindowKey("limits", "agent limits", tab="agents", events=["agent.*", "setting.*"]),
                                       WindowKey("count-agents", "agent cards --show all --reusable", arguments=["role", "profile", "page"], loading=KeyLoading.REQUESTED, events=["agent.*"])]),
               WindowDeclaration("coding.file-feed", "File feed", "file-feed.js", WindowLoading.COMPONENT, skeleton=CODING_FILE_FEED_SKELETON, search=WindowSearch(FileEditSearcher, "Filter files"), icon=WindowIcon.FILE, shows=WindowShows.SELECTED_AGENT, auto_scroll=AutoScroll.BOTTOM, reads=[*FILE_EDIT_READS, "file-edit file", "window setting"],
                                 events=["file_edit.create"],
                                 keys=[WindowKey("edits", "file-edit list", events=["file_edit.create"], arguments=["agent", "limit", "before-id", "after-id"], page_size=50),
                                       WindowKey("view", "window setting coding.file-feed view"),
                                       WindowKey("file.*", "file-edit file {id}")]),
               WindowDeclaration("coding.file-edits", "File edits", "file-edits.js", WindowLoading.COMPONENT, skeleton=CODING_FILE_EDITS_SKELETON, search=WindowSearch(FileEditSearcher, "Filter files"), icon=WindowIcon.COMMIT, reads=[*FILE_EDIT_READS, "agent list"],
                                 events=["file_edit.create"], keys=[WindowKey("edits", "file-edit list", events=["file_edit.create"], arguments=["limit", "before-id", "after-id"], page_size=50)]),
               WindowDeclaration("coding.terminal", "Terminal", "terminal.js", WindowLoading.COMPONENT, skeleton=CODING_TERMINAL_SKELETON, icon=WindowIcon.TERMINAL, shows=WindowShows.SELECTED_AGENT, auto_scroll=AutoScroll.BOTTOM,
                                 reads=["agent terminal", "hook-call feed", "output hook-page"], runs=["agent type"], events=["hook_call.*"],
                                 keys=[WindowKey("calls", "hook-call feed", events=["hook_call.*"], arguments=["session-agent-id", "limit", "before-id", "after-id"], page_size=200),
                                       WindowKey("terminal-output.*", "output hook-page {id}", arguments=["before", "after"])],
                                 options=[ChoiceOption("verbosity", "Detail level", [("commands", "Commands"), ("journal", "Commands and journal"), ("everything", "Show everything")], "everything")])]
