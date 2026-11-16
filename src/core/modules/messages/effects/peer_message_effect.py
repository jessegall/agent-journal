from collections.abc import Sequence

from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.provider.peer_note import PeerNote
from engine.provider.providers import Providers
from engine.provider.transcript_entries import TranscriptEntries
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.messages.commands.record_peer_message.record_peer_message import RecordPeerMessage
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message


from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from core.modules.drivers.support.minute_tick import MinuteTick

AGENT_MESSAGE_TOOL = "SendMessage"


PEER_MESSAGE_KEY = "messages.peer"


class PeerMessageEffect(EventEffect):
    """A message another agent session sent to the main agent shows in the chat once it reaches the agent's
    transcript, also while the agent waits, read at its minute step from the tick that step replaces; and so
    does a message the main agent sends to another agent."""

    key = PEER_MESSAGE_KEY
    events = list(HookEventName)
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, queries: Queries, providers: Providers, transcripts: TranscriptEntries, minute_tick: MinuteTick) -> None:
        self.queries, self.providers, self.transcripts, self.minute_tick = queries, providers, transcripts, minute_tick

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        event = event if event is not None else self.minute_tick.event(agent_id)
        provider = self.providers.provider(event.program)
        path = provider.transcript_path(event)
        notes = self.transcripts.peer_notes(provider, path) if path is not None else ()
        commands: list[Command[object]] = [RecordPeerMessage(agent_id, note.sender, note.text, note.key) for note in self.new_notes(agent_id, notes)]
        if self.is_agent_message(event):
            tool_input = event.tool_input()
            commands.append(RecordPeerMessage(agent_id, self.recipient_name(f"{tool_input.get('to', '')}", notes), f"{tool_input.get('message', '')}", f"{event.event_id}", True))
        return commands

    @staticmethod
    def recipient_name(recipient: str, notes: Sequence[PeerNote]) -> str:
        return next((note.sender for note in reversed(notes) if recipient and note.address == recipient), recipient)

    @staticmethod
    def is_agent_message(event: HookEvent) -> bool:
        tool = event.tool
        return tool is not None and tool.name == AGENT_MESSAGE_TOOL and event.event is HookEventName.POST_TOOL_USE

    def new_notes(self, agent_id: int, notes: Sequence[PeerNote]) -> list[PeerNote]:
        if not notes:
            return []
        saved_keys = set(self.queries.query(Message).filter(session_agent_id=agent_id, type=MessageType.PEER).matching(Among("peer_key", tuple(note.key for note in notes))).pluck("peer_key", str))
        return [note for note in notes if note.key not in saved_keys]
