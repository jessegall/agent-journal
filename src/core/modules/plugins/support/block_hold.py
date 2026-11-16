from typing import TypedDict


class BlockHold(TypedDict):
    """Version 2 of the hold contract a plugin reads beside the version 1 row of a block's event."""

    version: int
    scope_tools: object
    scope_stop: object
    ends: object
    waived_by: object
    closed_reason: object
    judgement: object
    escalation_id: object
    stop_deferred: bool
