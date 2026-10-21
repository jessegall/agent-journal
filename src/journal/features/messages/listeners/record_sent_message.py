from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent_listener import AgentListener
from journal.support.actor import Actor
from journal.models.message import Message
from journal.repositories.messages import Messages

SENDS = "SendMessage"
"""Claude Code's tool for a message to another agent: a subagent it runs, or another Claude session."""


class RecordSentMessage(AgentListener[ToolFinished]):
    """A message the agent sent another agent with Claude Code's own tool reaches the chat, named as sent to that agent; one that only asks to be told when the other is idle says nothing and is left out."""

    def __init__(self, messages: Messages) -> None:
        self.messages = messages

    def handle(self, event: ToolFinished) -> None:
        if event.call.tool != SENDS or event.subagent or not str(event.call.input.get("message", "")).strip():
            return
        self.messages.save(Message.sent_to(str(event.call.input.get("to", "")), str(event.call.input["message"]).strip(), event.session), Actor.agent(event.session))
