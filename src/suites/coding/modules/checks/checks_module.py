from suites.coding.modules.checks.models.declarations.check_model_declaration import CheckModelDeclaration
from suites.coding.modules.checks.skills.declarations.checks_skills import CHECKS_SKILLS
from suites.coding.modules.checks.windows.extensions.shell_checks_extension import ShellChecksExtension
from suites.coding.modules.checks.windows.checks_windows import CHECKS_WINDOWS
from core.modules.tasks.support.task_wait_attempts import TaskWaitAttempts
from suites.coding.modules.checks.migrations.m009_live_check_index import ActiveCheckIndexMigration
from suites.coding.modules.checks.support.check_task_wait_attempts import CheckTaskWaitAttempts
from suites.coding.modules.checks.migrations.m008_open_check_hidden_index import OpenCheckHiddenIndexMigration
from suites.coding.modules.checks.migrations.m007_check_task_wait_index import CheckTaskWaitIndexMigration
from suites.coding.modules.checks.migrations.m006_open_check_result_index import OpenCheckResultIndexMigration
from suites.coding.modules.checks.commands.check_runs.check_runs_subcommand import CheckRunsSubcommand
from suites.coding.modules.checks.support.check_nudges import CHECK_NUDGES
from engine.module.module import Module
from engine.check.periodic_checks import PeriodicChecks
from engine.check.step_checks import StepChecks
from suites.coding.modules.checks.support.passed_checks import PassedChecks
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
from suites.coding.modules.checks.upgrade.checks_move import ChecksMove
from suites.coding.modules.checks.seeders.checks_seeder import ChecksSeeder
from suites.coding.modules.checks.rules.failed_check_rule import FailedCheckRule
from suites.coding.modules.checks.support.block_conditions.check_passed import CheckPassed
from suites.coding.modules.checks.support.check_library_share import CheckLibraryShare
from suites.coding.modules.checks.inspectors.check_inspector import CheckInspector



class ChecksModule(Module):
    """Adds checks: a command that proves a point, run by hand or on a schedule; the agent hears once when it
    fails."""

    name = "journal.suites.coding.checks"
    window_extensions = [ShellChecksExtension]
    nudges = CHECK_NUDGES
    requires_engine = ">=5,<6"
    block_conditions = [CheckPassed]
    dependencies = ["journal.suites.coding", "journal.core.actors", "journal.core.agents", "journal.core.drivers", "journal.core.tasks", "journal.core.viewer"]
    skills = CHECKS_SKILLS
    library_shares = [CheckLibraryShare]
    models = [CheckModelDeclaration]
    inspectors = [CheckInspector]
    listeners = [TaskWaitCheckListener, TaskWaitPassListener, EndedCheckRunsListener]
    migrations = [ActiveCheckIndexMigration, OpenCheckHiddenIndexMigration, CheckTaskWaitIndexMigration, OpenCheckResultIndexMigration, ChecksTableMigration, CheckTaskWaitMigration, CheckHiddenMigration, CheckRunPercentMigration, OpenTaskWaitIndexMigration]
    handlers = [MakeCheckHandler, EditCheckHandler, RecordCheckRunHandler, RecordCheckProgressHandler, StartCheckHandler, StopCheckHandler, RemoveCheckHandler, ReportCheckHandler]
    subcommands = [CheckRunsSubcommand, MakeCheckSubcommand, CreateCheckSubcommand, EditCheckSubcommand, RunCheckSubcommand, StartCheckSubcommand, StopCheckSubcommand, RemoveCheckSubcommand, CheckListSubcommand, CheckShowSubcommand]
    driver_rules = [FailedCheckRule, BrokenTaskWaitRule]
    bindings = {PeriodicChecks: DueCheckRuns, StepChecks: PassedChecks, TaskWaitAttempts: CheckTaskWaitAttempts}
    windows = CHECKS_WINDOWS
    seeders = [ChecksSeeder]
    moves = [ChecksMove]
