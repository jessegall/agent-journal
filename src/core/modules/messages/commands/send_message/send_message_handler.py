from engine.row.metadata import Metadata
from core.modules.messages.support.message_reactions import MessageReactions
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from core.modules.agents.models.agent import Agent
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.scope.scopes import Scopes
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.models.message import Message
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.support.message_files import MessageFiles
from core.modules.messages.support.messages_module_name import MESSAGES_MODULE
from core.modules.messages.support.message_targets import MessageTargets
from core.modules.messages.support.work_sources import WorkSources
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.models.enums.work_source_origin import WorkSourceOrigin


ACTOR_MESSAGE_TYPES = {ActorType.USER: MessageType.USER, ActorType.AGENT: MessageType.AGENT}


class SendMessageHandler(Handler[SendMessage, Message]):
    """Saves a message from the caller: a user's is a user message, an agent's an agent message,
    anything else the journal's."""

    command = SendMessage

    def __init__(self, repository: Repository, files: MessageFiles, rows: EventRows, targets: MessageTargets, scopes: Scopes, sources: WorkSources) -> None:
        self.repository, self.files, self.rows = repository, files, rows
        self.targets, self.scopes = targets, scopes
        self.sources = sources

    def handle(self, command: SendMessage, context: Context) -> Message:
        if command.parent_id is not None and context.actor.type is ActorType.AGENT and MessageReactions.is_emoji(command.text):
            raise Refusal(f"a reply of only {command.text} is not posted", f'react instead: journal message react {command.parent_id} "{command.text}"')
        actor = context.actor
        if actor.type is ActorType.AGENT and self.rows.required(Agent, actor.id).role != AgentRole.MAIN:
            raise Refusal("only a main agent writes in the chat", "message the agent that sent you with --to agent:N")
        if command.parent_id is None:
            return self.sent(command, None, context)
        parent = self.rows.required(Message, command.parent_id)
        if actor.type is ActorType.AGENT and parent.type in PERSON_MESSAGE_TYPES:
            self.sources.select(parent, WorkSourceOrigin.REPLY, context)
            self.mark_answered_read(parent, context)
        with self.scopes.row_scope(parent):
            return self.sent(command, parent, context)

    def mark_answered_read(self, parent: Message, context: Context) -> None:
        if parent.read_at is None:
            self.repository.update(parent, context, read_at=context.timestamp)

    def answered_agent_name(self, parent: Message | None, actor: Actor) -> str:
        if parent is None or actor.type is not ActorType.AGENT or parent.type is not MessageType.AGENT or parent.session_agent_id in (None, actor.id):
            return ""
        return self.rows.required(Agent, parent.session_agent_id).display_name

    def sent(self, command: SendMessage, parent: Message | None, context: Context) -> Message:
        actor = context.actor
        target_id = command.target_agent_id
        if target_id is None and parent is not None:
            target_id = parent.target_agent_id
        target = self.targets.selected(target_id) if actor.type is ActorType.USER else None
        names = self.files.check(command.files)
        message_type = ACTOR_MESSAGE_TYPES.get(actor.type, MessageType.JOURNAL)
        metadata = Metadata({MESSAGES_MODULE: {"commented_row": {"model": command.commented_row[0], "id": command.commented_row[1]}}}) if command.commented_row else Metadata()
        message = Message(session_agent_id=actor.id if actor.type is ActorType.AGENT else None,
                          target_agent_id=self.targets.stored_id(target, target_id),
                          parent_id=command.parent_id, creator_id=actor.id, type=MessageType.COMMENT if command.commented_row and message_type is MessageType.USER else message_type,
                          text=command.text, files=names, metadata=metadata, is_chat_visible=command.is_chat_visible, is_agent_text=command.is_agent_text,
                          recipient=self.answered_agent_name(parent, actor))
        saved = self.repository.save(message, context)
        self.files.attach(saved.id, command.files)
        return saved
