from core.modules.tasks.support.task_wait_attempts import TaskWaitAttempts
from suites.coding.modules.checks.migrations.m009_live_check_index import LiveCheckIndexMigration
from suites.coding.modules.checks.support.check_task_wait_attempts import CheckTaskWaitAttempts
from suites.coding.modules.checks.migrations.m008_open_check_hidden_index import OpenCheckHiddenIndexMigration
from suites.coding.modules.checks.migrations.m007_check_task_wait_index import CheckTaskWaitIndexMigration
from suites.coding.modules.checks.migrations.m006_open_check_result_index import OpenCheckResultIndexMigration
from suites.coding.modules.checks.commands.check_runs.check_runs_subcommand import CheckRunsSubcommand
from suites.coding.modules.checks.support.check_nudges import CHECK_NUDGES
from engine.skill.skill_declaration import SkillDeclaration
from engine.module.model_declaration import ModelDeclaration
from engine.module.module import Module
from engine.viewer.window_search import WindowSearch
from suites.coding.modules.checks.support.check_searcher import CheckSearcher
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_key import WindowKey
from engine.viewer.window_extension import WindowExtension
from engine.enums.window_icon import WindowIcon
from engine.check.periodic_checks import PeriodicChecks
from engine.check.step_checks import StepChecks
from suites.coding.modules.checks.support.passed_checks import PassedChecks
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from suites.coding.modules.checks.commands.check_list.check_list_subcommand import CheckListSubcommand
from suites.coding.modules.checks.commands.check_show.check_show_subcommand import CheckShowSubcommand
from suites.coding.modules.checks.commands.edit_check.edit_check_handler import EditCheckHandler
from suites.coding.modules.checks.commands.edit_check.edit_check_subcommand import EditCheckSubcommand
from suites.coding.modules.checks.commands.make_check.make_check_handler import MakeCheckHandler
from suites.coding.modules.checks.commands.create_check.create_check_subcommand import CreateCheckSubcommand
from suites.coding.modules.checks.commands.make_check.make_check_subcommand import MakeCheckSubcommand
from suites.coding.modules.checks.commands.remove_check.remove_check_handler import RemoveCheckHandler
from suites.coding.modules.checks.commands.remove_check.remove_check_subcommand import RemoveCheckSubcommand
from suites.coding.modules.checks.commands.record_check_progress.record_check_progress_handler import RecordCheckProgressHandler
from suites.coding.modules.checks.commands.record_check_run.record_check_run_handler import RecordCheckRunHandler
from suites.coding.modules.checks.listeners.ended_check_runs_listener import EndedCheckRunsListener
from suites.coding.modules.checks.support.due_check_runs import DueCheckRuns
from suites.coding.modules.checks.commands.run_check.run_check_subcommand import RunCheckSubcommand
from suites.coding.modules.checks.commands.start_check.start_check_handler import StartCheckHandler
from suites.coding.modules.checks.commands.start_check.start_check_subcommand import StartCheckSubcommand
from suites.coding.modules.checks.commands.stop_check.stop_check_handler import StopCheckHandler
from suites.coding.modules.checks.commands.stop_check.stop_check_subcommand import StopCheckSubcommand
from suites.coding.modules.checks.commands.report_check.report_check_handler import ReportCheckHandler
from suites.coding.modules.checks.listeners.task_wait_check_listener import TaskWaitCheckListener
from suites.coding.modules.checks.listeners.task_wait_pass_listener import TaskWaitPassListener
from suites.coding.modules.checks.migrations.m001_checks import ChecksTableMigration
from suites.coding.modules.checks.migrations.m002_check_task_wait import CheckTaskWaitMigration
from suites.coding.modules.checks.migrations.m003_check_hidden import CheckHiddenMigration
from suites.coding.modules.checks.migrations.m004_check_run_percent import CheckRunPercentMigration
from suites.coding.modules.checks.migrations.m005_open_task_wait_index import OpenTaskWaitIndexMigration
from suites.coding.modules.checks.rules.broken_task_wait_rule import BrokenTaskWaitRule
from suites.coding.modules.checks.models.check import Check
from suites.coding.modules.checks.queries.check_query import CheckQuery
from suites.coding.modules.checks.upgrade.checks_move import ChecksMove
from suites.coding.modules.checks.seeders.checks_seeder import ChecksSeeder
from suites.coding.modules.checks.rules.failed_check_rule import FailedCheckRule
from suites.coding.modules.checks.support.block_conditions.check_passed import CheckPassed
from suites.coding.modules.checks.support.check_library_share import CheckLibraryShare
from suites.coding.modules.checks.support.skeletons import CHECKS_CHECKS_SKELETON
from suites.coding.modules.checks.support.check_inspector import CHECK_INSPECTOR

BUILT = ["make", "edit", "show", "list", "delete"]


class ChecksModule(Module):
    """Adds checks: a command that proves a point, run by hand or on a schedule; the agent hears once when it
    fails."""

    name = "journal.suites.coding.checks"
    window_extensions = [WindowExtension("viewer.shell", reads=["check show"], runs=["check run", "check stop"])]
    nudges = CHECK_NUDGES
    requires_core = ">=5,<6"
    block_conditions = [CheckPassed]
    dependencies = ["journal.suites.coding", "journal.core.actors", "journal.core.agents", "journal.core.drivers", "journal.core.tasks", "journal.core.viewer"]
    skills = [SkillDeclaration("journal-checks", "Write and run scripts that pass or fail about the project; read it when a check is made, run or fails", keywords=("check", "checks"), commands=["check"])]
    library_shares = [CheckLibraryShare]
    models = [ModelDeclaration(Check, query=CheckQuery, excluded_subcommands=BUILT)]
    inspectors = [CHECK_INSPECTOR]
    listeners = [TaskWaitCheckListener, TaskWaitPassListener, EndedCheckRunsListener]
    migrations = [LiveCheckIndexMigration, OpenCheckHiddenIndexMigration, CheckTaskWaitIndexMigration, OpenCheckResultIndexMigration, ChecksTableMigration, CheckTaskWaitMigration, CheckHiddenMigration, CheckRunPercentMigration, OpenTaskWaitIndexMigration]
    handlers = [MakeCheckHandler, EditCheckHandler, RecordCheckRunHandler, RecordCheckProgressHandler, StartCheckHandler, StopCheckHandler, RemoveCheckHandler, ReportCheckHandler]
    subcommands = [CheckRunsSubcommand, MakeCheckSubcommand, CreateCheckSubcommand, EditCheckSubcommand, RunCheckSubcommand, StartCheckSubcommand, StopCheckSubcommand, RemoveCheckSubcommand, CheckListSubcommand, CheckShowSubcommand]
    driver_rules = [FailedCheckRule, BrokenTaskWaitRule]
    bindings = {PeriodicChecks: DueCheckRuns, StepChecks: PassedChecks, TaskWaitAttempts: CheckTaskWaitAttempts}
    windows = [WindowDeclaration("checks.checks", "Checks", "checks.js", WindowLoading.COMPONENT, skeleton=CHECKS_CHECKS_SKELETON, search=WindowSearch(CheckSearcher, "Search the checks"), place=WindowPlace.PAGE, group="project", icon=WindowIcon.CHECK,
                                 reads=["check list", "check runs"], runs=["check run", "check start"], events=["check.*"],
                                 keys=[WindowKey("checks", "check list", events=["check.*"]), WindowKey("runs.*", "check runs {id}")])]
    seeders = [ChecksSeeder]
    moves = [ChecksMove]
