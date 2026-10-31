from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from suites.coding.modules.checks.commands.check_list_subcommand import CheckListSubcommand
from suites.coding.modules.checks.commands.edit_check_handler import EditCheckHandler
from suites.coding.modules.checks.commands.edit_check_subcommand import EditCheckSubcommand
from suites.coding.modules.checks.commands.make_check_handler import MakeCheckHandler
from suites.coding.modules.checks.commands.make_check_subcommand import MakeCheckSubcommand
from suites.coding.modules.checks.commands.remove_check_handler import RemoveCheckHandler
from suites.coding.modules.checks.commands.remove_check_subcommand import RemoveCheckSubcommand
from suites.coding.modules.checks.commands.run_check_handler import RunCheckHandler
from suites.coding.modules.checks.commands.run_check_subcommand import RunCheckSubcommand
from suites.coding.modules.checks.commands.stop_check_handler import StopCheckHandler
from suites.coding.modules.checks.commands.stop_check_subcommand import StopCheckSubcommand
from suites.coding.modules.checks.commands.report_check_handler import ReportCheckHandler
from suites.coding.modules.checks.migrations.m001_checks import ChecksTableMigration
from suites.coding.modules.checks.models.check import Check
from suites.coding.modules.checks.queries.check_query import CheckQuery
from suites.coding.modules.checks.upgrade.checks_move import ChecksMove
from suites.coding.modules.checks.seeders.checks_seeder import ChecksSeeder
from suites.coding.modules.checks.rules.due_check_rule import DueCheckRule
from suites.coding.modules.checks.rules.failed_check_rule import FailedCheckRule

BUILT = ["make", "edit", "show", "list", "delete"]


class ChecksModule(Module):
    """Adds checks: a command that proves a point, run by hand or on a schedule; the agent hears once when it fails."""

    name = "journal.suites.coding.checks"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers"]
    models = [ModelDeclaration(Check, query=CheckQuery, excluded_subcommands=BUILT)]
    migrations = [ChecksTableMigration]
    handlers = [MakeCheckHandler, EditCheckHandler, RunCheckHandler, StopCheckHandler, RemoveCheckHandler, ReportCheckHandler]
    subcommands = (MakeCheckSubcommand, EditCheckSubcommand, RunCheckSubcommand, StopCheckSubcommand, RemoveCheckSubcommand, CheckListSubcommand)
    driver_rules = [FailedCheckRule, DueCheckRule]
    windows = [WindowDeclaration("checks.checks", "Checks", "checks.js", WindowLoading.COMPONENT, icon=WindowIcon.CHECK,
                                 reads=["check list"], events=["check.*"])]
    seeders = [ChecksSeeder]
    moves = [ChecksMove]
