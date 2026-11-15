from core.modules.approvals.models.declarations.approval_request_model_declaration import ApprovalRequestModelDeclaration
from core.modules.approvals.models.declarations.standing_approval_model_declaration import StandingApprovalModelDeclaration
from core.modules.approvals.docks.approvals_docks import APPROVALS_DOCKS
from core.modules.approvals.commands.answer_agent_approval.answer_agent_approval_handler import AnswerAgentApprovalHandler
from core.modules.approvals.commands.answer_agent_approval.answer_agent_approval_subcommand import AnswerAgentApprovalSubcommand
from engine.module.module import Module
from core.modules.approvals.commands.accept_approval.accept_approval_subcommand import AcceptApprovalSubcommand
from core.modules.approvals.commands.close_user_approval.close_user_approval_handler import CloseUserApprovalHandler
from core.modules.approvals.commands.answer_approval.answer_approval_handler import AnswerApprovalHandler
from core.modules.approvals.commands.move_approval.move_approval_handler import MoveApprovalHandler
from core.modules.approvals.commands.recover_approvals.recover_approvals_handler import RecoverApprovalsHandler
from core.modules.approvals.commands.pending_approvals.pending_approvals_subcommand import PendingApprovalsSubcommand
from core.modules.approvals.commands.deny_approval.deny_approval_subcommand import DenyApprovalSubcommand
from core.modules.approvals.commands.request_user_approval.request_user_approval_handler import RequestUserApprovalHandler
from core.modules.approvals.listeners.approval_dock_listener import ApprovalDockListener
from core.modules.approvals.listeners.approval_notice_listener import ApprovalNoticeListener
from core.modules.approvals.listeners.pending_approval_dock_listener import PendingApprovalDockListener
from core.modules.approvals.guards.approval_decision_guard import ApprovalDecisionGuard
from core.modules.approvals.nudges.approval_pending_nudge import ApprovalPendingNudge
from core.modules.approvals.nudges.approval_decided_nudge import ApprovalDecidedNudge
from core.modules.approvals.nudges.approval_failed_nudge import ApprovalFailedNudge
from core.modules.approvals.nudges.approval_review_nudge import ApprovalReviewNudge
from core.modules.approvals.migrations.m001_approval_requests import ApprovalRequestsMigration
from core.modules.approvals.migrations.m007_approval_failure import ApprovalFailureMigration
from core.modules.approvals.migrations.m002_approval_recipients import ApprovalRecipientsMigration
from core.modules.approvals.migrations.m003_approval_commands import ApprovalCommandsMigration
from core.modules.approvals.migrations.m004_standing_approvals import StandingApprovalsMigration
from core.modules.approvals.migrations.m005_approval_why import ApprovalWhyMigration
from core.modules.approvals.migrations.m006_plain_column_names import PlainColumnNamesMigration
from core.modules.approvals.commands.check_approval_works.check_approval_works_handler import CheckApprovalWorksHandler
from core.modules.approvals.guards.standing_approval_guard import StandingApprovalGuard
from core.modules.approvals.commands.make_standing_approval.make_standing_approval_handler import MakeStandingApprovalHandler
from core.modules.approvals.commands.accept_covered_approval.accept_covered_approval_handler import AcceptCoveredApprovalHandler
from core.modules.approvals.listeners.standing_approval_accept_listener import StandingApprovalAcceptListener
from core.modules.approvals.listeners.every_approval_accept_listener import EveryApprovalAcceptListener
from core.modules.approvals.listeners.standing_approval_dock_listener import StandingApprovalDockListener
from core.modules.approvals.listeners.standing_approval_mark_listener import StandingApprovalMarkListener
from core.modules.approvals.marks.approval_standing_mark import ApprovalStandingMark
from core.modules.approvals.commands.relay_approval.relay_approval_handler import RelayApprovalHandler
from core.modules.approvals.commands.relay_approval.relay_approval_subcommand import RelayApprovalSubcommand
from core.modules.approvals.support.approval_buttons import APPROVAL_SLOT
from core.modules.approvals.tick_handlers.recover_approvals_tick_handler import RecoverApprovalsTickHandler
from core.modules.approvals.buttons.approvals_accept_button import ApprovalsAcceptButton
from core.modules.approvals.buttons.approvals_refuse_button import ApprovalsRefuseButton



class ApprovalsModule(Module):
    """Asks for every user-only approval through one persistent dock card."""

    name = "journal.core.approvals"
    requires_engine = ">=5,<6"
    move_reason = "approval requests are new in version 5"
    seed_reason = "the demo has no pending approval requests"
    dependencies = ["journal.core.agents", "journal.core.actors", "journal.core.environments", "journal.core.docking", "journal.core.viewer", "journal.core.chat", "journal.core.drivers", "journal.core.settings"]
    models = [ApprovalRequestModelDeclaration, StandingApprovalModelDeclaration]
    migrations = [ApprovalFailureMigration, PlainColumnNamesMigration, ApprovalRequestsMigration, ApprovalRecipientsMigration, ApprovalCommandsMigration, StandingApprovalsMigration, ApprovalWhyMigration]
    handlers = [AcceptCoveredApprovalHandler, MakeStandingApprovalHandler, CheckApprovalWorksHandler, RequestUserApprovalHandler, MoveApprovalHandler, AnswerApprovalHandler, CloseUserApprovalHandler, RelayApprovalHandler, AnswerAgentApprovalHandler, RecoverApprovalsHandler]
    tick_handlers = [RecoverApprovalsTickHandler]
    subcommands = [AcceptApprovalSubcommand, DenyApprovalSubcommand, PendingApprovalsSubcommand, RelayApprovalSubcommand, AnswerAgentApprovalSubcommand]
    listeners = [StandingApprovalDockListener, StandingApprovalAcceptListener, EveryApprovalAcceptListener, StandingApprovalMarkListener, ApprovalDockListener, ApprovalNoticeListener, PendingApprovalDockListener]
    guards = [ApprovalDecisionGuard, StandingApprovalGuard]
    marks = [ApprovalStandingMark]
    nudges = [ApprovalPendingNudge, ApprovalDecidedNudge, ApprovalFailedNudge, ApprovalReviewNudge]
    docks = APPROVALS_DOCKS
    button_slots = list(APPROVAL_SLOT)
    buttons = [ApprovalsAcceptButton,
               ApprovalsRefuseButton]
