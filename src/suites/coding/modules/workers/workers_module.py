from suites.coding.modules.workers.declarations.workers_effects import WORKERS_EFFECTS
from suites.coding.modules.workers.declarations.workers_states import WORKERS_STATES
from suites.coding.modules.workers.declarations.workers_lines import WORKERS_LINES
from suites.coding.modules.workers.declarations.workers_policies import WORKERS_POLICIES
from suites.coding.modules.workers.declarations.workers_dependencies import WORKERS_DEPENDENCIES
from suites.coding.modules.workers.declarations.workers_buttons import WORKERS_BUTTONS
from suites.coding.modules.workers.declarations.workers_former_event_keys import WORKERS_FORMER_EVENT_KEYS
from suites.coding.modules.workers.declarations.workers_bindings import WORKERS_BINDINGS
from suites.coding.modules.workers.declarations.workers_tick_handlers import WORKERS_TICK_HANDLERS
from suites.coding.modules.workers.support.block_conditions.delivered_proofs_checked import DeliveredProofsChecked
from suites.coding.modules.workers.listeners.worktree_step_listener import WorktreeStepListener
from suites.coding.modules.workers.listeners.proof_step_listener import ProofStepListener
from suites.coding.modules.workers.guards.proved_delivery_guard import ProvedDeliveryGuard
from suites.coding.modules.workers.support.workers_module_agent_messages import WORKERS_MODULE_AGENT_MESSAGES
from suites.coding.modules.workers.models.workers_models import WORKERS_MODELS
from suites.coding.modules.workers.migrations.workers_migrations import WORKERS_MIGRATIONS
from suites.coding.modules.workers.upgrade.workers_moves import WORKERS_MOVES
from suites.coding.modules.workers.commands.workers_handlers import WORKERS_HANDLERS
from suites.coding.modules.workers.commands.workers_subcommands import WORKERS_SUBCOMMANDS
from suites.coding.modules.workers.guards.workers_guards import WORKERS_GUARDS
from suites.coding.modules.workers.listeners.workers_listeners import WORKERS_LISTENERS
from suites.coding.modules.workers.windows.extensions.workers_window_extensions import WORKERS_WINDOW_EXTENSIONS
from suites.coding.modules.workers.skills.declarations.workers_skills import WORKERS_SKILLS
from suites.coding.modules.workers.windows.workers_windows import WORKERS_WINDOWS
from suites.coding.modules.workers.models.worker_work_review import WorkerWorkReview
from suites.coding.support.shipped_profiles import WORKER_PROFILES
from suites.coding.modules.workers.marks.worker_split_mark import WorkerSplitMark
from suites.coding.modules.workers.marks.worker_tests_mark import WorkerTestsMark
from suites.coding.modules.workers.marks.worker_mark import WorkerMark
from suites.coding.modules.workers.models.worker_progress import WorkerProgress
from engine.module.module import Module
from suites.coding.modules.workers.types.merger import Merger
from suites.coding.modules.workers.types.worker import Worker
from suites.coding.modules.workers.models.worker_points import WorkerPoints
from suites.coding.modules.workers.models.worker_wait import WorkerWait
from suites.coding.modules.workers.support.worker_settings import WORKER_SETTINGS



from suites.coding.modules.workers.support.worker_templates import WORKER_TEMPLATES
from suites.coding.modules.workers.types.support.workers_helper_lines import WorkersHelperLines


class WorkersModule(Module):
    """Adds the coding suite's workers: the worktree each one writes in and the proofs it shows for its task.
    """

    name = "journal.suites.coding.workers"
    effects = WORKERS_EFFECTS
    block_conditions = [DeliveredProofsChecked]
    states = WORKERS_STATES
    lines = WORKERS_LINES
    policies = WORKERS_POLICIES
    profiles = WORKER_PROFILES
    helper_types = [Worker, Merger]
    helper_lines = [WorkersHelperLines]
    templates = WORKER_TEMPLATES
    window_extensions = WORKERS_WINDOW_EXTENSIONS
    agent_messages = WORKERS_MODULE_AGENT_MESSAGES
    seed_reason = "a worker needs a git worktree, which a scratch demo has none of"
    requires_engine = ">=6,<7"
    settings = WORKER_SETTINGS
    dependencies = WORKERS_DEPENDENCIES
    buttons = WORKERS_BUTTONS
    skills = WORKERS_SKILLS
    models = WORKERS_MODELS
    migrations = WORKERS_MIGRATIONS
    views = [WorkerWorkReview, WorkerPoints, WorkerWait, WorkerProgress]
    moves = WORKERS_MOVES
    handlers = WORKERS_HANDLERS
    subcommands = WORKERS_SUBCOMMANDS
    guards = [ProvedDeliveryGuard, *WORKERS_GUARDS]
    marks = [WorkerSplitMark, WorkerTestsMark, WorkerMark]
    declared_plugin_events = ["worker_clocking_out", "worker_delivering", "worker_merging"]
    former_event_keys = WORKERS_FORMER_EVENT_KEYS
    bindings = WORKERS_BINDINGS
    listeners = [*WORKERS_LISTENERS]
    agent_listeners = [WorktreeStepListener, ProofStepListener]
    tick_handlers = WORKERS_TICK_HANDLERS
    windows = WORKERS_WINDOWS
