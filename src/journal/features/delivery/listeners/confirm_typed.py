from journal.engine.typed_lines import TypedLines
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent_listener import AgentListener
from journal.supervisor_link import SupervisorLink


class ConfirmTyped(AgentListener[PromptSubmitted]):
    """A prompt carrying a typed line's words proves the line arrived, and the next held line goes in."""

    def __init__(self, typed: TypedLines, supervisor: SupervisorLink) -> None:
        self.typed, self.supervisor = typed, supervisor

    def handle(self, event: PromptSubmitted) -> None:
        self.typed.confirm(event.environment_id, event.prompt)
        self.supervisor.release(event.environment_id)
