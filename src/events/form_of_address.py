"""What the form-of-address feature recognises: the way the user wants to be talked to has changed."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class VoiceChanged(Fact):
    """The profile the agent talks as, or how it calls the user, changed while this agent runs."""

    agent: int
