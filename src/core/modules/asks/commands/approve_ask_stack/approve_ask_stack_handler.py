from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.asks.commands.approve_ask_stack.approve_ask_stack import ApproveAskStack
from core.modules.asks.models.ask_stack import AskStack


class ApproveAskStackHandler(Handler[ApproveAskStack, AskStack]):
    """Clears a waiting stack's wait for the user; the guard on stacks refuses an agent."""

    command = ApproveAskStack

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ApproveAskStack, context: Context) -> AskStack:
        return self.repository.update(self.queries.query(AskStack).find(command.stack_id), context, needs_approval=False)
