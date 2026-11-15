from dataclasses import dataclass


@dataclass(frozen=True)
class AdmissionReceipt:
    """The record that a hook admitted a journal command by spending a grant, which the command's own entrance
    accepts once."""

    agent_id: int
    event_id: str
    command_fingerprint: str
    policy_key: str
    grant_id: int
    is_consumed: bool = False
