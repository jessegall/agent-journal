from core.modules.tasks.support.tasks_block_conditions import TASKS_BLOCK_CONDITIONS
from core.modules.tasks.support.tasks_dependencies import TASKS_DEPENDENCIES
from core.modules.tasks.support.tasks_models import TASKS_MODELS
from core.modules.tasks.support.tasks_migrations import TASKS_MIGRATIONS
from core.modules.tasks.support.tasks_subcommands import TASKS_SUBCOMMANDS
from core.modules.tasks.support.tasks_handlers import TASKS_HANDLERS
from core.modules.tasks.support.tasks_guards import TASKS_GUARDS
from core.modules.tasks.support.tasks_views import TASKS_VIEWS
from core.modules.tasks.support.tasks_listeners import TASKS_LISTENERS
from core.modules.tasks.support.tasks_lines import TASKS_LINES
from core.modules.tasks.states.task_work_states import TaskWorkStates
from core.modules.tasks.states.unlogged_write_states import UnloggedWriteStates
from core.modules.tasks.states.block_review_states import BlockReviewStates
from core.modules.tasks.effects.block_review_effect import BlockReviewEffect
from core.modules.tasks.windows.tasks_windows import TASKS_WINDOWS
from core.modules.tasks.docks.tasks_docks import TASKS_DOCKS
from core.modules.tasks.skills.declarations.tasks_skills import TASKS_SKILLS
from core.modules.agents.support.agent_task_reads import AgentTaskReads
from core.modules.tasks.support.row_agent_task_reads import RowAgentTaskReads
from core.modules.tasks.support.task_agent_messages import TASK_AGENT_MESSAGES
from core.modules.tasks.upgrade.tasks_move import TasksMove
from engine.module.module import Module
from core.modules.tasks.inspectors.task_inspector import TaskInspector
from core.modules.tasks.marks.task_mark import TaskMark
from core.modules.tasks.seeders.tasks_seeder import TasksSeeder
from core.modules.tasks.support.task_settings import TASK_SETTINGS
from core.modules.tasks.tick_handlers.task_state_round_tick_handler import TaskStateRoundTickHandler



class TasksModule(Module):
    """Adds tasks, units of work current by an agent, with their log lines and dependencies, and the rules
    that keep an agent at its task."""

    name = "journal.core.tasks"
    agent_messages = TASK_AGENT_MESSAGES
    settings = TASK_SETTINGS
    requires_engine = ">=5,<6"
    block_conditions = TASKS_BLOCK_CONDITIONS
    dependencies = TASKS_DEPENDENCIES
    bindings = {AgentTaskReads: RowAgentTaskReads}
    skills = TASKS_SKILLS
    models = TASKS_MODELS
    migrations = TASKS_MIGRATIONS
    subcommands = TASKS_SUBCOMMANDS
    tick_handlers = [TaskStateRoundTickHandler]
    handlers = TASKS_HANDLERS
    moves = [TasksMove]
    guards = TASKS_GUARDS
    views = TASKS_VIEWS
    listeners = TASKS_LISTENERS
    marks = [TaskMark]
    former_event_keys = {"core.tasks.task.drop_hold": "core.tasks.task.release_holder"}
    docks = TASKS_DOCKS
    states = [TaskWorkStates, UnloggedWriteStates, BlockReviewStates]
    effects = [BlockReviewEffect]
    lines = TASKS_LINES
    windows = TASKS_WINDOWS
    inspectors = [TaskInspector]
    seeders = [TasksSeeder]
