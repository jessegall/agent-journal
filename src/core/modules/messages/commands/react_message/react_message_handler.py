from engine.scope.actor_scope import ActorScope
from core.modules.messages.agent_messages.message_reaction_notice import MessageReactionNotice
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.driver.message_sender import MessageSender
from core.modules.messages.commands.react_message.react_message import ReactMessage
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_reactions import MessageReactions
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.messages.support.work_sources import WorkSources

REACTION_SOURCE = "messages.reaction"


class ReactMessageHandler(Handler[ReactMessage, Message]):
    """Puts a face on a message, or takes it off; a face the user puts on is told to the environment's main
    agent."""

    command = ReactMessage
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, repository: Repository, message_sender: MessageSender, agents: AgentRows, sources: WorkSources) -> None:
        self.rows, self.repository, self.message_sender, self.agents = rows, repository, message_sender, agents
        self.sources = sources

    def handle(self, command: ReactMessage, context: Context) -> Message:
        if not MessageReactions.is_emoji(command.emoji):
            raise Refusal(f"{command.emoji} is no face", "a reaction is one emoji, such as 👍")
        message = self.rows.required(Message, command.message_id)
        previous = len(MessageReactions.decoded(message))
        saved = self.repository.update(message, context, reactions=MessageReactions.toggled(message, context.actor, command.emoji))
        self.sources.clear_provisional(message, context)
        if context.actor.is_person() and len(MessageReactions.decoded(saved)) > previous:
            self.notify_agents(saved, context)
        return saved

    def notify_agents(self, message: Message, context: Context) -> None:
        for agent in self.agents.main_agents():
            self.message_sender.send(agent.id, MessageReactionNotice.declared(), REACTION_SOURCE, context, message=message.id)
