from argparse import ArgumentParser, Namespace
from typing import ClassVar

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.approvals.commands.answer_approval.answer_approval import AnswerApproval
from core.modules.approvals.models.enums.approval_decision import ApprovalDecision
from core.modules.approvals.models.enums.standing_scope import StandingScope
from core.modules.approvals.support.approval_result import ApprovalResult


class AnswerApprovalSubcommand(Subcommand[AnswerApproval, ApprovalResult]):
    decision: ClassVar[ApprovalDecision]
    cli_name = "approval"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("row_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> AnswerApproval:
        return AnswerApproval(arguments.row_id, self.decision, StandingScope(arguments.always) if getattr(arguments, "always", None) else None)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ApprovalResult):
            output.write(value.output or f"approval {value.request.id}: {value.request.state.value}",
                         {"request_id": value.request.id, "state": value.request.state.value,
                          "viewer_output": value.output if value.request.returns_output else ""})
