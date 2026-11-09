import json

from core.base.command.command_json import TYPE_KEY
from core.base.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.standing_scope import StandingScope
from core.modules.approvals.models.standing_approval import StandingApproval

COMMAND_TYPE_WORD_COUNT = 2


class StandingApprovals:
    """Tells what kind a request is and what it targets, and finds the standing yes of its environment that
    covers it. A request's kind is its command's class, or the first two words of its command line; its
    target is the next word of the line, or the first field of the command, the program or row it is about."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def category(self, request: ApprovalRequest) -> str:
        if request.command_json:
            return str(json.loads(request.command_json)[TYPE_KEY]).rpartition(".")[2]
        return " ".join(request.arguments[:COMMAND_TYPE_WORD_COUNT])

    def target(self, request: ApprovalRequest) -> str:
        if request.command_json:
            values = list(json.loads(request.command_json)["fields"].values())
            return str(values[0]) if values else ""
        return request.arguments[COMMAND_TYPE_WORD_COUNT] if len(request.arguments) > COMMAND_TYPE_WORD_COUNT else ""

    @staticmethod
    def match_key(request: ApprovalRequest) -> str:
        return json.dumps([list(request.arguments), request.command_json, list(request.refused_arguments), list(request.continued_arguments)])

    def build_standing(self, request: ApprovalRequest, scope: StandingScope, creator_id: int) -> StandingApproval:
        category, target = self.category(request), self.target(request)
        text = f"{category} {target}".strip() if scope is StandingScope.LIKE else f"{category}: {request.text}"
        return StandingApproval(creator_id=creator_id, scope=scope, category=category, target=target, match_key=self.match_key(request), text=text)

    def covering(self, request: ApprovalRequest) -> StandingApproval | None:
        category, target, match_key = self.category(request), self.target(request), self.match_key(request)
        standing = self.queries.query(StandingApproval).filter(category=category).oldest().all_rows()
        return next((row for row in standing if row.scope is StandingScope.LIKE and row.target == target or row.scope is StandingScope.EXACT and row.match_key == match_key), None)
