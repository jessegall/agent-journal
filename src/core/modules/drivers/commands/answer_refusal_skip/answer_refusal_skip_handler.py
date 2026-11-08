from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.drivers.commands.answer_refusal_skip.answer_refusal_skip import AnswerRefusalSkip
from core.modules.drivers.models.refusal_skip import RefusalSkip


class AnswerRefusalSkipHandler(Handler[AnswerRefusalSkip, RefusalSkip]):
    """Confirms or withdraws an agent's own held skip, once: a confirmed skip passes the refusal's next attempt and
    keeps what the agent tried beside its reason; a withdrawn one leaves the refusal in force. Neither can be changed
    afterwards."""

    command = AnswerRefusalSkip

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: AnswerRefusalSkip, context: Context) -> RefusalSkip:
        skip = self.queries.query(RefusalSkip).find(command.skip_id)
        if skip.session_agent_id != context.actor.id:
            raise Refusal(f"skip {skip.id} is not yours", "answer only a skip you made")
        if skip.is_answered:
            raise Refusal(f"skip {skip.id} was answered already, and its answer is final", "make a new skip if the refusal meets you again")
        if not command.is_confirmed:
            return self.repository.update(skip, context, withdrawn_at=context.timestamp)
        tried = command.tried.strip()
        if not tried or tried == skip.reason:
            raise Refusal("name what you tried before skipping, not the reason again", "--tried '<what you tried instead>'")
        return self.repository.update(skip, context, confirmed_at=context.timestamp, tried=tried)
