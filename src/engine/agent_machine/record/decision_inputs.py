from dataclasses import dataclass

from engine.agent_stack.need_key import NeedKey


@dataclass(frozen=True)
class DecisionInputs:
    """What a decision was made from, kept so the shadow can compare it: the table digest and slices, and the
    needs, holds and grants read."""

    table_digest: str
    slices: tuple[str, ...]
    need_keys: tuple[NeedKey, ...]
    block_ids: tuple[int, ...]
    grant_ids: tuple[int, ...]
