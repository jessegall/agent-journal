"""What open viewer recognises: an agent that just started in the main environment while a viewer runs."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class ViewerTabToOpen(Fact):
    """The first start of this agent session while a viewer runs at this address, so its tab is brought to the front."""

    url: str
