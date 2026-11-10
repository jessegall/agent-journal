from engine.enums.actor_type import ActorType
from core.base.command.context import Context
from engine.errors.refusal import Refusal
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.base.query.queries import Queries
from core.modules.drivers.models.permission_request import PermissionRequest


class PermissionAnswerers:
    """Who may answer a request for leave: the main agent of its environment, or a person; the asker never
    answers its own, and only a person answers one that needs a person."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, request: PermissionRequest, context: Context) -> None:
        if context.actor.type is ActorType.USER:
            return
        main = MainAgentFinder.newest(self.queries)
        if request.needs_person or context.actor.id == request.asker_id or main is None or main.id != context.actor.id:
            raise Refusal(f"only the main agent, or a person where the action needs one, answers request {request.id}")
