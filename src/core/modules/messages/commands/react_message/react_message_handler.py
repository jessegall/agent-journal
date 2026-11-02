from core.modules.messages.support.message_nudges import MESSAGE_REACTION
from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.messages.commands.react_message.react_message import ReactMessage
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_reactions import MessageReactions

REACTION_SOURCE = "messages.reaction"


class ReactMessageHandler(Handler[ReactMessage, Message]):
    """Puts a face on a message, or takes it off; a face the user puts on is told to the environment's main agent."""

    command = ReactMessage

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

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
        line = MESSAGE_REACTION.nudge(emoji=emoji, message=message.id).text
        for agent in tuple(self.queries.query(Agent).filter(environment_id=message.environment_id, role=AgentRole.MAIN).matching(IsNull("ended_at")).all_rows()):
            self.repository.save(AgentLine(agent_id=agent.id, creator_id=context.actor.id, text=line, source=REACTION_SOURCE), context)
