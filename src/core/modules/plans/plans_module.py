from core.modules.plans.declarations.plans_dependencies import PLANS_DEPENDENCIES
from core.modules.plans.declarations.plans_models import PLANS_MODELS
from core.modules.plans.declarations.plans_migrations import PLANS_MIGRATIONS
from core.modules.plans.declarations.plans_handlers import PLANS_HANDLERS
from core.modules.plans.declarations.plans_subcommands import PLANS_SUBCOMMANDS
from core.modules.plans.declarations.plans_guards import PLANS_GUARDS
from core.modules.plans.declarations.plans_listeners import PLANS_LISTENERS
from core.modules.plans.states.plan_context_states import PlanContextStates
from core.modules.plans.lines.plan_context_lines import PlanContextLines
from core.modules.plans.lines.plan_focus_lines import PlanFocusLines
from core.modules.plans.lines.plan_order_lines import PlanOrderLines
from core.modules.plans.lines.plan_state_lines import PlanStateLines
from core.modules.plans.lines.plan_task_end_lines import PlanTaskEndLines
from core.modules.plans.windows.extensions.chat_active_agents_extension import ChatActiveAgentsExtension
from core.modules.plans.windows.plans_windows import PLANS_WINDOWS
from core.modules.plans.docks.plans_docks import PLANS_DOCKS
from core.modules.plans.skills.declarations.plans_skills import PLANS_SKILLS
from core.modules.plans.support.plan_settings import PLAN_SETTINGS
from core.modules.plans.support.block_conditions.plan_context_read import PlanContextRead as PlanContextReadCondition
from core.modules.plans.step_conditions.plan_brief_set import PlanBriefSet
from core.modules.plans.step_conditions.plan_has_phases import PlanHasPhases
from core.modules.plans.step_conditions.plan_phases_have_tasks import PlanPhasesHaveTasks
from core.modules.plans.step_conditions.plan_tasks_ordered import PlanTasksOrdered
from core.modules.plans.models.plan_progress import PlanProgress
from core.modules.plans.models.plan_card import PlanCard
from core.modules.plans.models.plan_event_row import PlanEventRow
from core.modules.plans.models.plan_outline_task import PlanOutlineTask
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.plan_shared_rows import PlanSharedRows
from engine.module.module import Module
from core.modules.plans.upgrade.plans_move import PlansMove
from core.modules.plans.marks.plan_mark import PlanMark
from core.modules.plans.support.plan_agent_messages import PLAN_AGENT_MESSAGES
from core.modules.plans.seeders.plans_seeder import PlansSeeder
from core.modules.plans.support.block_conditions.plan_approved import PlanApproved
from core.modules.plans.support.block_conditions.plan_finished import PlanFinished
from engine.plan.plan_authors import PlanAuthors
from core.modules.plans.bindings.plan_row_authors import PlanRowAuthors
from core.modules.plans.bindings.focused_block_review_scope import FocusedBlockReviewScope
from core.modules.tasks.support.block_review_scope import BlockReviewScope


from core.modules.plans.inspectors.plan_inspector import PlanInspector
from core.modules.plans.tick_handlers.plan_state_round_tick_handler import PlanStateRoundTickHandler
from core.modules.plans.buttons.plans_approve_button import PlansApproveButton


class PlansModule(Module):
    """Adds plans: a goal, its phases in order, and the tasks placed in each."""

    name = "journal.core.plans"
    settings = PLAN_SETTINGS
    requires_engine = ">=7,<8"
    block_conditions = [PlanApproved, PlanFinished, PlanContextReadCondition]
    bindings = {PlanAuthors: PlanRowAuthors, BlockReviewScope: FocusedBlockReviewScope}
    dependencies = PLANS_DEPENDENCIES
    skills = PLANS_SKILLS
    models = PLANS_MODELS
    migrations = PLANS_MIGRATIONS
    tick_handlers = [PlanStateRoundTickHandler]
    handlers = PLANS_HANDLERS
    moves = [PlansMove]
    subcommands = PLANS_SUBCOMMANDS
    views = [PlanTask, PlanProgress, PlanCard, PlanOutlineTask, PlanEventRow]
    guards = PLANS_GUARDS
    step_conditions = [PlanBriefSet, PlanHasPhases, PlanPhasesHaveTasks, PlanTasksOrdered]
    listeners = PLANS_LISTENERS
    marks = [PlanMark]
    agent_messages = PLAN_AGENT_MESSAGES
    states = [PlanContextStates]
    lines = [PlanContextLines, PlanFocusLines, PlanOrderLines, PlanStateLines, PlanTaskEndLines]
    docks = PLANS_DOCKS
    window_extensions = [ChatActiveAgentsExtension]
    buttons = [PlansApproveButton]
    windows = PLANS_WINDOWS
    inspectors = [PlanInspector]

    shared_rows = [PlanSharedRows]
    seeders = [PlansSeeder]
