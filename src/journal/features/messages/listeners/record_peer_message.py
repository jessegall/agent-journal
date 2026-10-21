from datetime import datetime, timezone

from journal.events.agent.peer_message import PeerMessage
from journal.events.agent_listener import AgentListener
from journal.support.actor import Actor
from journal.repositories.messages import Messages


class RecordPeerMessage(AgentListener[PeerMessage]):
    """A message another session's agent sent this one reaches the chat as that agent's, written by it as an external agent, never as the user's words; whether it came as a prompt or mid-turn."""

    def __init__(self, messages: Messages) -> None:
        self.messages = messages

    def handle(self, event: PeerMessage) -> None:
        self.messages.save(event.message(datetime.now(timezone.utc)), Actor.external(event.sender))
