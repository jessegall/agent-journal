from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.asks.commands.end_replaced_ask_stacks.end_replaced_ask_stacks import EndReplacedAskStacks
from core.modules.asks.models.ask_stack import AskStack


class EndReplacedAskStacksHandler(Handler[EndReplacedAskStacks, None]):
    """Ends every open stack of the same topic and the same wait for the user as the given one, but the given one."""

    command = EndReplacedAskStacks

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: EndReplacedAskStacks, context: Context) -> None:
        stack = self.queries.query(AskStack).find(command.stack_id)
        replaced = self.queries.query(AskStack).filter(environment_id=stack.environment_id, topic=stack.topic, needs_approval=stack.needs_approval).matching(IsNull("ended_at")).get()
        for other in replaced:
            if other.id != stack.id:
                self.repository.update(other, context, ended_at=context.timestamp)
