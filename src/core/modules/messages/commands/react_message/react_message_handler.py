from core.base.scope.actor_scope import ActorScope
from core.modules.messages.support.message_nudges import MESSAGE_REACTION
from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.drivers.support.nudger import Nudger
from core.modules.messages.commands.react_message.react_message import ReactMessage
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_reactions import MessageReactions
from core.modules.agents.support.main_agent_finder import MainAgentFinder

REACTION_SOURCE = "messages.reaction"


class ReactMessageHandler(Handler[ReactMessage, Message]):
    """Puts a face on a message, or takes it off; a face the user puts on is told to the environment's main
    agent."""

    command = ReactMessage
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, nudger: Nudger) -> None:
        self.queries, self.repository, self.nudger = queries, repository, nudger

    def handle(self, command: ReactMessage, context: Context) -> Message:
        if not MessageReactions.is_emoji(command.emoji):
            raise Refusal(f"{command.emoji} is no face", "a reaction is one emoji, such as 👍")
        message = self.queries.query(Message).find(command.message_id)
        previous = len(MessageReactions.decoded(message))
        saved = self.repository.save(message.changed(reactions=MessageReactions.toggled(message, context.actor, command.emoji)), context)
        if context.actor.type is ActorType.USER and len(MessageReactions.decoded(saved)) > previous:
            self.notify_agents(saved, command.emoji, context)
        return saved

    def notify_agents(self, message: Message, emoji: str, context: Context) -> None:
        for agent in tuple(MainAgentFinder.rows(self.queries)):
            self.nudger.send(agent.id, MESSAGE_REACTION, REACTION_SOURCE, context, emoji=emoji, message=message.id)
