from journal.engine.typed_lines import TypedLines
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.features.agent_listener import AgentListener


class ConfirmTyped(AgentListener[PromptSubmitted]):
    """A prompt carrying a typed line's words proves the line arrived."""

    def __init__(self, typed: TypedLines) -> None:
        self.typed = typed

    def handle(self, event: PromptSubmitted) -> None:
        self.typed.confirm(event.environment_id, event.prompt)
