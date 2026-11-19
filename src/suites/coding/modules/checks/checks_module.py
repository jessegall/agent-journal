from suites.coding.modules.checks.declarations.checks_dependencies import CHECKS_DEPENDENCIES
from suites.coding.modules.checks.declarations.checks_migrations import CHECKS_MIGRATIONS
from suites.coding.modules.checks.declarations.checks_handlers import CHECKS_HANDLERS
from suites.coding.modules.checks.declarations.checks_subcommands import CHECKS_SUBCOMMANDS
from suites.coding.modules.checks.declarations.checks_bindings import CHECKS_BINDINGS
from suites.coding.modules.checks.lines.broken_task_wait_lines import BrokenTaskWaitLines
from suites.coding.modules.checks.lines.failed_check_lines import FailedCheckLines
from suites.coding.modules.checks.wake_causes.check_failed_wake import CheckFailedWake
from suites.coding.modules.checks.effects.failed_check_effect import FailedCheckEffect
from suites.coding.modules.checks.models.declarations.check_model_declaration import CheckModelDeclaration
from suites.coding.modules.checks.skills.declarations.checks_skills import CHECKS_SKILLS
from suites.coding.modules.checks.windows.extensions.shell_checks_extension import ShellChecksExtension
from suites.coding.modules.checks.windows.checks_windows import CHECKS_WINDOWS
from suites.coding.modules.checks.support.check_agent_messages import CHECK_AGENT_MESSAGES
from engine.module.module import Module
from suites.coding.modules.checks.listeners.ended_check_runs_listener import EndedCheckRunsListener
from suites.coding.modules.checks.listeners.task_wait_check_listener import TaskWaitCheckListener
from suites.coding.modules.checks.listeners.task_wait_pass_listener import TaskWaitPassListener
from suites.coding.modules.checks.upgrade.checks_move import ChecksMove
from suites.coding.modules.checks.seeders.checks_seeder import ChecksSeeder
from suites.coding.modules.checks.support.block_conditions.check_passed import CheckPassed
from suites.coding.modules.checks.support.check_library_share import CheckLibraryShare
from suites.coding.modules.checks.inspectors.check_inspector import CheckInspector



class ChecksModule(Module):
    """Adds checks: a command that proves a point, run by hand or on a schedule; the agent hears once when it
    fails."""

    name = "journal.suites.coding.checks"
    effects = [FailedCheckEffect]
    lines = [BrokenTaskWaitLines, FailedCheckLines]
    wake_causes = [CheckFailedWake]
    window_extensions = [ShellChecksExtension]
    agent_messages = CHECK_AGENT_MESSAGES
    requires_engine = ">=7,<8"
    block_conditions = [CheckPassed]
    dependencies = CHECKS_DEPENDENCIES
    skills = CHECKS_SKILLS
    library_shares = [CheckLibraryShare]
    models = [CheckModelDeclaration]
    inspectors = [CheckInspector]
    listeners = [TaskWaitCheckListener, TaskWaitPassListener, EndedCheckRunsListener]
    migrations = CHECKS_MIGRATIONS
    handlers = CHECKS_HANDLERS
    subcommands = CHECKS_SUBCOMMANDS
    bindings = CHECKS_BINDINGS
    windows = CHECKS_WINDOWS
    seeders = [ChecksSeeder]
    moves = [ChecksMove]
