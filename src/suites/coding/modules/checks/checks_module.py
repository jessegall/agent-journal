from suites.coding.modules.checks.support.check_nudges import CHECK_NUDGES
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.periodic_checks import PeriodicChecks
from core.base.viewer.window_loading import WindowLoading
from suites.coding.modules.checks.commands.check_list.check_list_subcommand import CheckListSubcommand
from suites.coding.modules.checks.commands.edit_check.edit_check_handler import EditCheckHandler
from suites.coding.modules.checks.commands.edit_check.edit_check_subcommand import EditCheckSubcommand
from suites.coding.modules.checks.commands.make_check.make_check_handler import MakeCheckHandler
from suites.coding.modules.checks.commands.create_check.create_check_subcommand import CreateCheckSubcommand
from suites.coding.modules.checks.commands.make_check.make_check_subcommand import MakeCheckSubcommand
from suites.coding.modules.checks.commands.remove_check.remove_check_handler import RemoveCheckHandler
from suites.coding.modules.checks.commands.remove_check.remove_check_subcommand import RemoveCheckSubcommand
from suites.coding.modules.checks.commands.record_check_run.record_check_run_handler import RecordCheckRunHandler
from suites.coding.modules.checks.support.due_check_runs import DueCheckRuns
from suites.coding.modules.checks.commands.run_check.run_check_subcommand import RunCheckSubcommand
from suites.coding.modules.checks.commands.stop_check.stop_check_handler import StopCheckHandler
from suites.coding.modules.checks.commands.stop_check.stop_check_subcommand import StopCheckSubcommand
from suites.coding.modules.checks.commands.report_check.report_check_handler import ReportCheckHandler
from suites.coding.modules.checks.listeners.task_wait_check_listener import TaskWaitCheckListener
from suites.coding.modules.checks.listeners.task_wait_pass_listener import TaskWaitPassListener
from suites.coding.modules.checks.migrations.m001_checks import ChecksTableMigration
from suites.coding.modules.checks.migrations.m002_check_task_wait import CheckTaskWaitMigration
from suites.coding.modules.checks.rules.broken_task_wait_rule import BrokenTaskWaitRule
from suites.coding.modules.checks.models.check import Check
from suites.coding.modules.checks.queries.check_query import CheckQuery
from suites.coding.modules.checks.upgrade.checks_move import ChecksMove
from suites.coding.modules.checks.seeders.checks_seeder import ChecksSeeder
from suites.coding.modules.checks.rules.failed_check_rule import FailedCheckRule

BUILT = ["make", "edit", "list", "delete"]


class ChecksModule(Module):
    """Adds checks: a command that proves a point, run by hand or on a schedule; the agent hears once when it fails."""

    name = "journal.suites.coding.checks"
    nudges = CHECK_NUDGES
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers", "journal.core.tasks"]
    models = [ModelDeclaration(Check, query=CheckQuery, excluded_subcommands=BUILT)]
    listeners = [TaskWaitCheckListener, TaskWaitPassListener]
    migrations = [ChecksTableMigration, CheckTaskWaitMigration]
    handlers = [MakeCheckHandler, EditCheckHandler, RecordCheckRunHandler, StopCheckHandler, RemoveCheckHandler, ReportCheckHandler]
    subcommands = (MakeCheckSubcommand, CreateCheckSubcommand, EditCheckSubcommand, RunCheckSubcommand, StopCheckSubcommand, RemoveCheckSubcommand, CheckListSubcommand)
    driver_rules = [FailedCheckRule, BrokenTaskWaitRule]
    bindings = [(PeriodicChecks, DueCheckRuns)]
    windows = [WindowDeclaration("checks.checks", "Checks", "checks.js", WindowLoading.COMPONENT, icon=WindowIcon.CHECK,
                                 reads=["check list"], events=["check.*"])]
    seeders = [ChecksSeeder]
    moves = [ChecksMove]
