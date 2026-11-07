from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.approvals.commands.relay_approval.relay_approval import RelayApproval
from core.modules.approvals.models.approval_request import ApprovalRequest


class RelayApprovalSubcommand(Subcommand[RelayApproval, ApprovalRequest]):
    cli_name = "approval"
    name = "relay"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("request_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RelayApproval:
        return RelayApproval(arguments.request_id)
