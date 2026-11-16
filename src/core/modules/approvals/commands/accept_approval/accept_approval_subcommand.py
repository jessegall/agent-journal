from argparse import ArgumentParser

from core.modules.approvals.commands.answer_approval.answer_approval_subcommand import AnswerApprovalSubcommand
from core.modules.approvals.models.enums.approval_decision import ApprovalDecision
from core.modules.approvals.models.enums.saved_scope import SavedScope


class AcceptApprovalSubcommand(AnswerApprovalSubcommand):
    decision = ApprovalDecision.ACCEPT
    name = "accept"

    def arguments(self, parser: ArgumentParser) -> None:
        super().arguments(parser)
        parser.add_argument("--always", choices=[scope.value for scope in SavedScope], default=None, help="also keep a saved yes: for the same request, or for any request like it")
