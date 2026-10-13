"""What the runtime cleanup feature recognises: an update that was installed, and that its trigger says it is time to tidy."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class UpdateInstalled(Fact):
    """The journal announced that it updated, which leaves old files behind."""

    notification: int


@dataclass(frozen=True, kw_only=True)
class RuntimeTidyDue(Fact):
    """The runtime cleanup trigger says it is time to remove what the runtime left behind."""

    agent: int
