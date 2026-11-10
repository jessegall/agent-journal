from dataclasses import dataclass

from core.base.command.make_command import MakeCommand
from engine.time.timestamp import Timestamp
from core.modules.helpers.models.provider_outage import ProviderOutage


@dataclass(frozen=True)
class MakeProviderOutage(MakeCommand[ProviderOutage]):
    """Records a temporary program outage."""

    program: str
    reason: str
    ends_at: Timestamp
