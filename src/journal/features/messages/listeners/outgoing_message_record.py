from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent_listener import AgentListener
from journal.support.actor import Actor
from journal.models.message import Message
from journal.repositories.messages import Messages
from journal.support.peer_name import PeerName
from journal.features.workers.support.subagent_entries import SubagentEntries
from journal.support.agent_message import AgentMessage



class OutgoingMessageRecord(AgentListener[ToolFinished]):
    """A message the agent sent another agent with Claude Code's own tool reaches the chat, named as sent to that agent, by its project's name when its address is a socket, or as failed with the tool's reason when the send did not arrive; one that only asks to be told when the other is idle says nothing and is left out."""

    def __init__(self, messages: Messages, names: PeerName) -> None:
        self.messages, self.names = messages, names

    def handle(self, event: ToolFinished) -> None:
        message = event.call.operation
        if not isinstance(message, AgentMessage) or event.subagent or not message.text.strip():
            return
        receiver, text = message.receiver, message.text.strip()
        answer = SubagentEntries.answered(event.response or event.output)
        if answer.get("success") is False:
            self.messages.save(Message.send_failed(self.names.resolve(receiver), text, event.session, receiver, str(answer.get("message", "the send failed"))), Actor.agent(event.session))
            return
        self.messages.save(Message.outgoing(self.names.resolve(receiver), text, event.session, receiver), Actor.agent(event.session))
