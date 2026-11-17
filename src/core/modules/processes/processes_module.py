from core.modules.processes.declarations.processes_effects import PROCESSES_EFFECTS
from core.modules.processes.declarations.processes_policies import PROCESSES_POLICIES
from core.modules.processes.declarations.processes_lines import PROCESSES_LINES
from core.modules.processes.declarations.processes_tick_handlers import PROCESSES_TICK_HANDLERS
from core.modules.processes.declarations.processes_block_conditions import PROCESSES_BLOCK_CONDITIONS
from core.modules.processes.declarations.processes_dependencies import PROCESSES_DEPENDENCIES
from core.modules.processes.declarations.processes_models import PROCESSES_MODELS
from core.modules.processes.declarations.processes_migrations import PROCESSES_MIGRATIONS
from core.modules.processes.declarations.processes_handlers import PROCESSES_HANDLERS
from core.modules.processes.declarations.processes_subcommands import PROCESSES_SUBCOMMANDS
from core.modules.processes.declarations.processes_listeners import PROCESSES_LISTENERS
from core.modules.processes.declarations.processes_bindings import PROCESSES_BINDINGS
from core.modules.processes.wake_causes.run_ended_wake import RunEndedWake
from core.modules.processes.listeners.run_end_step_listener import RunEndStepListener
from core.modules.processes.listeners.watch_step_listener import WatchStepListener
from core.modules.processes.states.watched_run_states import WatchedRunStates
from core.modules.processes.states.long_run_dock_states import LongRunDockStates
from core.modules.processes.states.reader_request_states import ReaderRequestStates
from core.modules.processes.states.silent_run_block_states import SilentRunBlockStates
from core.modules.processes.story_steps.processes_story_steps import PROCESSES_STORY_STEPS
from core.modules.processes.windows.extensions.agents_processes_extension import AgentsProcessesExtension
from core.modules.processes.windows.extensions.helpers_processes_extension import HelpersProcessesExtension
from core.modules.processes.windows.extensions.agents_lift_block_extension import AgentsLiftBlockExtension
from core.modules.processes.windows.processes_windows import PROCESSES_WINDOWS
from core.modules.processes.docks.processes_docks import PROCESSES_DOCKS
from core.modules.processes.skills.declarations.processes_skills import PROCESSES_SKILLS
from core.modules.processes.support.process_agent_messages import PROCESS_AGENT_MESSAGES
from engine.module.module import Module
from core.modules.processes.upgrade.processes_move import ProcessesMove
from core.modules.processes.marks.process_command_mark import ProcessCommandMark
from core.modules.processes.models.process_row import ProcessRow
from core.modules.processes.guards.ended_process_dock_guard import EndedProcessDockGuard
from core.modules.processes.guards.run_owner_parts_guard import RunOwnerPartsGuard
from core.modules.processes.guards.run_owner_reports_guard import RunOwnerReportsGuard
from core.modules.processes.guards.reader_owner_guard import ReaderOwnerGuard
from core.modules.processes.models.process_queue_row import ProcessQueueRow
from core.modules.processes.models.enums.process_setting import PROCESS_SETTINGS
from core.modules.processes.seeders.processes_seeder import ProcessesSeeder



from core.modules.processes.inspectors.queue_inspector import QueueInspector


class ProcessesModule(Module):
    """Adds processes: every shell line an agent runs is kept as a numbered process with its parts and its
    output."""

    name = "journal.core.processes"
    agent_listeners = [RunEndStepListener, WatchStepListener]
    states = [WatchedRunStates, LongRunDockStates, ReaderRequestStates, SilentRunBlockStates]
    effects = PROCESSES_EFFECTS
    policies = PROCESSES_POLICIES
    lines = PROCESSES_LINES
    agent_messages = PROCESS_AGENT_MESSAGES
    tick_handlers = PROCESSES_TICK_HANDLERS
    skills = PROCESSES_SKILLS
    requires_engine = ">=7,<8"
    block_conditions = PROCESSES_BLOCK_CONDITIONS
    settings = PROCESS_SETTINGS
    moves = [ProcessesMove]
    dependencies = PROCESSES_DEPENDENCIES
    models = PROCESSES_MODELS
    views = [ProcessRow, ProcessQueueRow]
    migrations = PROCESSES_MIGRATIONS
    handlers = PROCESSES_HANDLERS
    subcommands = PROCESSES_SUBCOMMANDS
    guards = [RunOwnerReportsGuard, RunOwnerPartsGuard, ReaderOwnerGuard, EndedProcessDockGuard]
    listeners = PROCESSES_LISTENERS
    wake_causes = [RunEndedWake]
    marks = [ProcessCommandMark]
    bindings = PROCESSES_BINDINGS
    docks = PROCESSES_DOCKS
    window_extensions = [AgentsProcessesExtension, HelpersProcessesExtension, AgentsLiftBlockExtension]
    windows = PROCESSES_WINDOWS
    inspectors = [QueueInspector]
    seeders = [ProcessesSeeder]
    story_steps = PROCESSES_STORY_STEPS
