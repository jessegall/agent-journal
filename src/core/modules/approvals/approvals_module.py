from core.base.chat.dock_declaration import DockDeclaration
from core.base.chat.mark_button import MarkButton
from core.modules.approvals.commands.answer_agent_approval.answer_agent_approval_handler import AnswerAgentApprovalHandler
from core.modules.approvals.commands.answer_agent_approval.answer_agent_approval_subcommand import AnswerAgentApprovalSubcommand
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.ticker.tick_handler import TickHandler
from core.base.ticker.tick_interval import TickInterval
from core.base.viewer.button_condition import ButtonCondition
from core.base.viewer.button_declaration import ButtonDeclaration
from core.modules.approvals.commands.accept_approval.accept_approval_subcommand import AcceptApprovalSubcommand
from core.modules.approvals.commands.close_user_approval.close_user_approval_handler import CloseUserApprovalHandler
from core.modules.approvals.commands.answer_approval.answer_approval_handler import AnswerApprovalHandler
from core.modules.approvals.commands.move_approval.move_approval_handler import MoveApprovalHandler
from core.modules.approvals.commands.recover_approvals.recover_approvals_handler import RecoverApprovalsHandler
from core.modules.approvals.ticks.recover_approvals_tick import RecoverApprovalsTick
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
from core.modules.approvals.migrations.m003_approval_commands import ApprovalCommandsMigration
from core.modules.approvals.migrations.m004_standing_approvals import StandingApprovalsMigration
from core.modules.approvals.migrations.m005_approval_why import ApprovalWhyMigration
from core.modules.approvals.commands.check_approval_works.check_approval_works_handler import CheckApprovalWorksHandler
from core.modules.approvals.models.standing_approval import StandingApproval
from core.modules.approvals.guards.standing_approval_guard import StandingApprovalGuard
from core.modules.approvals.commands.make_standing_approval.make_standing_approval_handler import MakeStandingApprovalHandler
from core.base.viewer.button_menu_item import ButtonMenuItem
from core.modules.approvals.commands.accept_covered_approval.accept_covered_approval_handler import AcceptCoveredApprovalHandler
from core.modules.approvals.listeners.standing_approval_accept_listener import StandingApprovalAcceptListener
from core.modules.approvals.listeners.standing_approval_dock_listener import StandingApprovalDockListener
from core.modules.approvals.listeners.standing_approval_mark_listener import StandingApprovalMarkListener
from core.modules.approvals.support.approval_marks import APPROVAL_MARKS
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
    dependencies = ["journal.core.agents", "journal.core.actors", "journal.core.environments", "journal.core.docking", "journal.core.viewer", "journal.core.chat"]
    models = [ModelDeclaration(ApprovalRequest, excluded_subcommands=["make", "edit", "delete", "begin", "accept", "refuse", "retry", "close"]), ModelDeclaration(StandingApproval, excluded_subcommands=["make", "edit"])]
    migrations = [ApprovalRequestsMigration, ApprovalRecipientsMigration, ApprovalCommandsMigration, StandingApprovalsMigration, ApprovalWhyMigration]
    handlers = [AcceptCoveredApprovalHandler, MakeStandingApprovalHandler, CheckApprovalWorksHandler, RequestUserApprovalHandler, MoveApprovalHandler, AnswerApprovalHandler, CloseUserApprovalHandler, RelayApprovalHandler, AnswerAgentApprovalHandler, RecoverApprovalsHandler]
    tick_handlers = [TickHandler(TickInterval(seconds=30), RecoverApprovalsTick(), "recover approvals", starts_immediately=True)]
    subcommands = [AcceptApprovalSubcommand, DenyApprovalSubcommand, PendingApprovalsSubcommand, RelayApprovalSubcommand, AnswerAgentApprovalSubcommand]
    listeners = [StandingApprovalDockListener, StandingApprovalAcceptListener, StandingApprovalMarkListener, ApprovalDockListener, ApprovalNoticeListener, PendingApprovalDockListener]
    guards = [ApprovalDecisionGuard, StandingApprovalGuard]
    marks = APPROVAL_MARKS
    nudges = [APPROVAL_PENDING, APPROVAL_DECIDED, APPROVAL_REVIEW]
    docks = [DockDeclaration(ApprovalDockType.REQUEST, "question", "Approval", "approval-dock.js", reads=["approval pending"], needs_user=True, reads_target=False),
             DockDeclaration(ApprovalDockType.STANDING_USED, "check", "Went on under a standing yes", reads=["standing-approval show"], buttons=[MarkButton("close", "Withdraw", "standing-approval delete {row_id}")], leaves_after_seconds=8)]
    button_slots = list(APPROVAL_SLOT)
    buttons = [ButtonDeclaration("approvals.accept", APPROVAL_SLOT, "Accept", "approval accept {row_id}", icon="check", primary=True, condition=OPEN_REQUEST,
                              menu=(ButtonMenuItem("Accept and always for the same request", "approval accept {row_id} --always same", description="Keeps a standing yes: the same kind of approval with the same command line, in this environment, is accepted with no card."),
                                    ButtonMenuItem("Accept and always for any request like it", "approval accept {row_id} --always like", description="Keeps a standing yes: the same kind of approval for the same program or target, whatever follows it, is accepted with no card."))),
               ButtonDeclaration("approvals.refuse", APPROVAL_SLOT, "Refuse", "approval refuse {row_id}", icon="cross", condition=OPEN_REQUEST)]
