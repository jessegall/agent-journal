from core.base.chat.dock_declaration import DockDeclaration
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.viewer.button_condition import ButtonCondition
from core.base.viewer.button_declaration import ButtonDeclaration
from core.modules.approvals.commands.accept_approval.accept_approval_subcommand import AcceptApprovalSubcommand
from core.modules.approvals.commands.close_user_approval.close_user_approval_handler import CloseUserApprovalHandler
from core.modules.approvals.commands.answer_approval.answer_approval_handler import AnswerApprovalHandler
from core.modules.approvals.commands.move_approval.move_approval_handler import MoveApprovalHandler
from core.modules.approvals.commands.pending_approvals.pending_approvals_subcommand import PendingApprovalsSubcommand
from core.modules.approvals.commands.deny_approval.deny_approval_subcommand import DenyApprovalSubcommand
from core.modules.approvals.commands.request_user_approval.request_user_approval_handler import RequestUserApprovalHandler
from core.modules.approvals.listeners.approval_dock_listener import ApprovalDockListener
from core.modules.approvals.listeners.approval_notice_listener import ApprovalNoticeListener
from core.modules.approvals.listeners.pending_approval_dock_listener import PendingApprovalDockListener
from core.modules.approvals.guards.approval_decision_guard import ApprovalDecisionGuard
from core.modules.approvals.support.approval_nudges import APPROVAL_PENDING, APPROVAL_DECIDED, APPROVAL_REVIEW
from core.modules.approvals.migrations.m001_approval_requests import ApprovalRequestsMigration
from core.modules.approvals.migrations.m002_approval_recipients import ApprovalRecipientsMigration
from core.modules.approvals.commands.relay_approval.relay_approval_handler import RelayApprovalHandler
from core.modules.approvals.commands.relay_approval.relay_approval_subcommand import RelayApprovalSubcommand
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_dock_type import ApprovalDockType

APPROVAL_SLOT = (f"dock.{ApprovalDockType.REQUEST.value}", "row.approval")
OPEN_REQUEST = ButtonCondition("state", tuple(["open"]))


class ApprovalsModule(Module):
    """Asks for every person-only approval through one persistent dock card."""

    name = "journal.core.approvals"
    requires_core = ">=5,<6"
    move_reason = "approval requests are new in version 5"
    seed_reason = "the demo has no pending approval requests"
    dependencies = ["journal.core.agents", "journal.core.actors", "journal.core.environments", "journal.core.docking", "journal.core.viewer"]
    models = [ModelDeclaration(ApprovalRequest, excluded_subcommands=["make", "edit", "delete", "begin", "accept", "refuse", "retry", "close"])]
    migrations = [ApprovalRequestsMigration, ApprovalRecipientsMigration]
    handlers = [RequestUserApprovalHandler, MoveApprovalHandler, AnswerApprovalHandler, CloseUserApprovalHandler, RelayApprovalHandler]
    subcommands = [AcceptApprovalSubcommand, DenyApprovalSubcommand, PendingApprovalsSubcommand, RelayApprovalSubcommand]
    listeners = [ApprovalDockListener, ApprovalNoticeListener, PendingApprovalDockListener]
    guards = [ApprovalDecisionGuard]
    nudges = [APPROVAL_PENDING, APPROVAL_DECIDED, APPROVAL_REVIEW]
    docks = [DockDeclaration(ApprovalDockType.REQUEST, "question", "Approval", "approval-dock.js", reads=["approval pending"], needs_user=True, reads_target=False)]
    button_slots = list(APPROVAL_SLOT)
    buttons = [ButtonDeclaration("approvals.accept", APPROVAL_SLOT, "Accept", "approval accept {row_id}", primary=True, condition=OPEN_REQUEST),
               ButtonDeclaration("approvals.refuse", APPROVAL_SLOT, "Refuse", "approval refuse {row_id}", condition=OPEN_REQUEST)]
