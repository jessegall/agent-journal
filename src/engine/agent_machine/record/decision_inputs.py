from dataclasses import dataclass

from engine.agent_stack.state_key import StateKey


@dataclass(frozen=True)
class DecisionInputs:
    """What a decision was made from: the table digest, and the needs, holds and grants read."""

    table_digest: str
    state_keys: tuple[StateKey, ...]
    block_ids: tuple[int, ...]
    grant_ids: tuple[int, ...]
