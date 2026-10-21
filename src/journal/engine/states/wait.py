from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.tool_starting import ToolStarting


@dataclass(frozen=True)
class Wait(BaseState):
    """The parent of every state that waits on something and is popped when it comes: a word from the user pops it, the agent's own tool use pops it, a journal command being none, and awaiting says what it waits for."""

    def wait_description(self) -> tuple[str, str]:
        return "", ""

    def is_waiting(self) -> bool:
        return True

    def on_prompt_submitted(self, event: PromptSubmitted, settings: Settings) -> Transition:
        return self.pop() if event.is_users else self.none()

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return self.none() if event.subagent or event.call.is_journal else self.pop()
