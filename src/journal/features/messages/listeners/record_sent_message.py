from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent_listener import AgentListener
from journal.support.actor import Actor
from journal.models.message import Message
from journal.repositories.messages import Messages
from journal.support.peer_name import PeerName

SENDS = "SendMessage"


class RecordSentMessage(AgentListener[ToolFinished]):
    """A message the agent sent another agent with Claude Code's own tool reaches the chat, named as sent to that agent, by its project's name when its address is a socket; one that only asks to be told when the other is idle says nothing and is left out."""

    def __init__(self, messages: Messages, names: PeerName) -> None:
        self.messages, self.names = messages, names

    def handle(self, event: ToolFinished) -> None:
        if event.call.tool != SENDS or event.subagent or not str(event.call.input.get("message", "")).strip():
            return
        receiver = str(event.call.input.get("to", ""))
        self.messages.save(Message.sent_to(self.names.resolve(receiver), str(event.call.input["message"]).strip(), event.session, receiver), Actor.agent(event.session))
