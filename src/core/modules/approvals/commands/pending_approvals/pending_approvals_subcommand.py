from argparse import Namespace

from engine.caller.caller import Caller
from engine.row.page import Page
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.approval_state import ApprovalState


class PendingApprovalsSubcommand(ReadSubcommand[Page[ApprovalRequest]]):
    cli_name = "approval"
    name = "pending"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def read(self, arguments: Namespace, caller: Caller) -> Page[ApprovalRequest]:
        rows = tuple(self.queries.query(ApprovalRequest).filter(recipient_agent_id=None).matching(Among("state", (ApprovalState.OPEN, ApprovalState.RUNNING))).newest().all_rows())
        return Page(rows, 1, len(rows), len(rows))
