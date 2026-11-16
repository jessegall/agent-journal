from core.modules.waits.declarations.waits_migrations import WAITS_MIGRATIONS
from core.modules.waits.listeners.wait_step_listener import WaitStepListener
from core.modules.waits.states.wait_states import WaitStates
from core.modules.waits.lines.long_wait_lines import LongWaitLines
from core.modules.waits.effects.work_ends_wait_effect import WorkEndsWaitEffect
from core.modules.waits.models.declarations.wait_model_declaration import WaitModelDeclaration
from core.modules.waits.models.declarations.wait_target_model_declaration import WaitTargetModelDeclaration
from engine.module.module import Module
from core.modules.waits.models.waiting_row import WaitingRow
from core.modules.waits.commands.waiting_wait.waiting_wait_subcommand import WaitingWaitSubcommand
from core.modules.waits.listeners.target_resolution_listener import TargetResolutionListener
from core.modules.waits.listeners.reported_wait_mark_listener import ReportedWaitMarkListener
from core.modules.waits.listeners.wait_end_listener import WaitEndListener
from core.modules.waits.support.wait_agent_messages import WAIT_AGENT_MESSAGES
from core.modules.waits.marks.reported_wait_mark import ReportedWaitMark
from core.modules.waits.commands.open_wait.open_wait_subcommand import OpenWaitSubcommand
from core.modules.waits.commands.open_wait.open_wait_handler import OpenWaitHandler
from core.modules.waits.commands.request_help.request_help_subcommand import RequestHelpSubcommand
from core.modules.waits.seeders.waits_seeder import WaitsSeeder


class WaitsModule(Module):
    """Adds waits: an agent waits on rows it does not control or reports it is stuck, and while the wait
    is open its Waiting stacked state holds the agent's stack."""

    name = "journal.core.waits"
    agent_listeners = [WaitStepListener]
    states = [WaitStates]
    effects = [WorkEndsWaitEffect]
    lines = [LongWaitLines]
    move_reason = "version 4 had no table for waits"
    requires_engine = ">=6,<7"
    dependencies = ["journal.core.actors", "journal.core.agents", "journal.core.drivers", "journal.core.chat"]
    models = [WaitModelDeclaration, WaitTargetModelDeclaration]
    migrations = WAITS_MIGRATIONS
    views = [WaitingRow]
    handlers = [OpenWaitHandler]
    subcommands = [OpenWaitSubcommand, RequestHelpSubcommand, WaitingWaitSubcommand]
    listeners = [TargetResolutionListener, ReportedWaitMarkListener, WaitEndListener]
    agent_messages = WAIT_AGENT_MESSAGES
    marks = [ReportedWaitMark]
    seeders = [WaitsSeeder]
