"""What the runtime cleanup feature recognises: an update that was installed."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class UpdateInstalled(Fact):
    """The journal announced that it updated, which leaves old files behind."""

    notification: int
