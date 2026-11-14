from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.approvals.commands.answer_agent_approval.answer_agent_approval import AnswerAgentApproval
from core.modules.approvals.models.approval_request import ApprovalRequest


class AnswerAgentApprovalSubcommand(Subcommand[AnswerAgentApproval, ApprovalRequest]):
    cli_name = "approval"
    name = "answer"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("request_id", type=int)
        parser.add_argument("--text", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> AnswerAgentApproval:
        return AnswerAgentApproval(arguments.request_id, arguments.text)
