from dataclasses import dataclass

from engine.change.domain_event import DomainEvent
from core.modules.drivers.models.hook_call import PROMPT, HookCall


@dataclass(frozen=True)
class PromptSubmitted(DomainEvent[HookCall]):
    """A prompt reached an agent."""

    change_name = PROMPT
