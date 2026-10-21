from dataclasses import dataclass


@dataclass(frozen=True)
class BriefingData:
    """The briefing feature's reading: whether the agent has looked at what is in flight, and what the start block names: the environment, when another session worked here lately, the rules, facts and reminders numbered, and what waits."""

    oriented: bool
    environment: str
    last_other_session_at: str
    rules: str
    rules_count: int
    facts: str
    reminders: str
    waiting: str
