from collections.abc import Sequence

from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.hook_wildcard import HookWildcard
from engine.driver.rule_answer import RuleAnswer
from engine.provider.peer_note import PeerNote
from engine.provider.providers import Providers
from engine.provider.transcript_entries import TranscriptEntries
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.messages.commands.record_peer_message.record_peer_message import RecordPeerMessage
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message


AGENT_MESSAGE_TOOL = "SendMessage"


class PeerMessageRule(DriverRule):
    """A message another agent session sent to the main agent shows in the chat once it reaches the agent's
    transcript, also while the agent waits; and so does a message the main agent sends to another agent."""

    name = "messages.peer"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    overlay_proof = True
    is_notice = True

    def __init__(self, queries: Queries, providers: Providers, transcripts: TranscriptEntries) -> None:
        self.queries, self.providers, self.transcripts = queries, providers, transcripts

    def answer(self, hook: AgentHook) -> RuleAnswer:
        provider = self.providers.provider(hook.event.program)
        path = provider.transcript_path(hook.event)
        notes = self.transcripts.peer_notes(provider, path) if path is not None else ()
        commands = [RecordPeerMessage(hook.agent_id, note.sender, note.text, note.key) for note in self.new_notes(hook.agent_id, notes)]
        if self.is_agent_message(hook):
            tool_input = hook.event.tool_input()
            commands.append(RecordPeerMessage(hook.agent_id, self.recipient_name(f"{tool_input.get('to', '')}", notes), f"{tool_input.get('message', '')}", f"{hook.event.firing}", True))
        return RuleAnswer.allowed().running(*commands)

    @staticmethod
    def recipient_name(recipient: str, notes: Sequence[PeerNote]) -> str:
        return next((note.sender for note in reversed(notes) if recipient and note.address == recipient), recipient)

    def is_agent_message(self, hook: AgentHook) -> bool:
        tool = hook.event.tool
        return tool is not None and tool.name == AGENT_MESSAGE_TOOL and hook.event.event is HookEventName.POST_TOOL_USE

    def new_notes(self, agent_id: int, notes: Sequence[PeerNote]) -> list[PeerNote]:
        if not notes:
            return []
        saved_keys = {message.peer_key for message in self.queries.query(Message).filter(session_agent_id=agent_id, type=MessageType.PEER).matching(Among("peer_key", tuple(note.key for note in notes))).all_rows()}
        return [note for note in notes if note.key not in saved_keys]
