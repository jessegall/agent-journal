from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Countdown(Model):
    """How many times in a row one actor has done a counted thing: the key names the countdown and the subject
    what it is counting now, so a new subject starts it again."""

    model_name = "countdown"
    cli_name = "countdown"

    actor_id: int
    creator_id: int
    key: str
    subject: str
    used_count: int = 0
