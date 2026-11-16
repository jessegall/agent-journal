from core.modules.approvals.declarations.approvals_former_event_keys import APPROVALS_FORMER_EVENT_KEYS
from core.modules.approvals.declarations.approvals_dependencies import APPROVALS_DEPENDENCIES
from core.modules.approvals.declarations.approvals_migrations import APPROVALS_MIGRATIONS
from core.modules.approvals.declarations.approvals_handlers import APPROVALS_HANDLERS
from core.modules.approvals.declarations.approvals_subcommands import APPROVALS_SUBCOMMANDS
from core.modules.approvals.declarations.approvals_listeners import APPROVALS_LISTENERS
from core.modules.approvals.declarations.approvals_agent_messages import APPROVALS_AGENT_MESSAGES
from core.modules.approvals.declarations.approvals_buttons import APPROVALS_BUTTONS
from core.modules.approvals.models.declarations.approval_request_model_declaration import ApprovalRequestModelDeclaration
from core.modules.approvals.models.declarations.saved_approval_model_declaration import SavedApprovalModelDeclaration
from core.modules.approvals.docks.approvals_docks import APPROVALS_DOCKS
from engine.module.module import Module
from core.modules.approvals.guards.approval_decision_guard import ApprovalDecisionGuard
from core.modules.approvals.guards.saved_approval_guard import SavedApprovalGuard
from core.modules.approvals.marks.approval_saved_mark import ApprovalSavedMark
from core.modules.approvals.support.approval_buttons import APPROVAL_SLOT
from core.modules.approvals.tick_handlers.recover_approvals_tick_handler import RecoverApprovalsTickHandler



class ApprovalsModule(Module):
    """Asks for every user-only approval through one persistent dock card."""

    name = "journal.core.approvals"
    requires_engine = ">=6,<7"
    move_reason = "approval requests are new in version 5"
    seed_reason = "the demo has no pending approval requests"
    dependencies = APPROVALS_DEPENDENCIES
    models = [ApprovalRequestModelDeclaration, SavedApprovalModelDeclaration]
    migrations = APPROVALS_MIGRATIONS
    handlers = APPROVALS_HANDLERS
    tick_handlers = [RecoverApprovalsTickHandler]
    subcommands = APPROVALS_SUBCOMMANDS
    listeners = APPROVALS_LISTENERS
    guards = [ApprovalDecisionGuard, SavedApprovalGuard]
    former_event_keys = APPROVALS_FORMER_EVENT_KEYS
    marks = [ApprovalSavedMark]
    agent_messages = APPROVALS_AGENT_MESSAGES
    docks = APPROVALS_DOCKS
    button_slots = list(APPROVAL_SLOT)
    buttons = APPROVALS_BUTTONS
