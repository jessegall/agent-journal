from journal.engine.state_machine import StateMachine
from journal.engine.nudger import Nudger
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent_listener import AgentListener
from journal.support.decision import Decision
from journal.providers.providers import Providers

SENT = "journal message send"


class HintReplyByTag(AgentListener[ToolFinished]):
    """A message the agent sends by command comes back with the hint that a reply can be typed, on that command's own result."""

    blocking = True

    def __init__(self, machine: StateMachine, nudger: Nudger, providers: Providers) -> None:
        self.machine, self.nudger, self.providers = machine, nudger, providers

    def handle(self, event: ToolFinished) -> Decision | None:
        from journal.features.messages.feature import Messages
        if event.tool != self.providers.named(event.provider).shell_tool or SENT not in event.input.get("command", ""):
            return None
        line = self.nudger.say(self.machine.agent(event.session, event.environment_id), Messages.REPLY_BY_TAG.create())
        return Decision.tell(line) if line else None
