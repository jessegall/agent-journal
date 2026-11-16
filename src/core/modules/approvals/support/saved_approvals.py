import json

from engine.command.command_json import TYPE_KEY
from engine.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.modules.approvals.models.enums.saved_scope import SavedScope
from core.modules.approvals.models.saved_approval import SavedApproval

SAVED_REASON = "a request is matched against the saved approvals of its category, oldest first"

COMMAND_TYPE_WORD_COUNT = 2


class SavedApprovals:
    """Tells what category a request is and what it targets, and finds the saved yes of its environment that
    covers it. A request's category is its command's class, or the first two words of its command line; its
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

    def build_saved(self, request: ApprovalRequest, scope: SavedScope, creator_id: int) -> SavedApproval:
        category, target = self.category(request), self.target(request)
        text = f"{category} {target}".strip() if scope is SavedScope.LIKE else f"{category}: {request.text}"
        return SavedApproval(creator_id=creator_id, scope=scope, category=category, target=target, match_key=self.match_key(request), text=text)

    def covering(self, request: ApprovalRequest) -> SavedApproval | None:
        category, target, match_key = self.category(request), self.target(request), self.match_key(request)
        saved = self.queries.query(SavedApproval).filter(category=category).every_row(SAVED_REASON)
        return next((row for row in saved if row.scope is SavedScope.LIKE and row.target == target or row.scope is SavedScope.EXACT and row.match_key == match_key), None)
