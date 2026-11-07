from core.modules.approvals.commands.answer_approval.answer_approval_subcommand import AnswerApprovalSubcommand
from core.modules.approvals.models.enums.approval_decision import ApprovalDecision


class DenyApprovalSubcommand(AnswerApprovalSubcommand):
    decision = ApprovalDecision.REFUSE
    name = "refuse"
