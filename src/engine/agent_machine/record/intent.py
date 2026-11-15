from dataclasses import dataclass

from engine.enums.intent_type import IntentType


@dataclass(frozen=True)
class Intent:
    """External work a step asks for after its commit, such as typing or a resume, done by its owner once per
    dedupe key."""

    intent_type: IntentType
    agent_id: int
    dedupe_key: str
    text: str = ""
