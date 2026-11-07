from core.base.change.changed import Changed
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.modules.helpers.models.provider_outage import ProviderOutage
from core.modules.helpers.support.program_change_access import ProgramChangeAccess


class ProviderOutageAccessGuard(Guard[Changed[ProviderOutage]]):
    """Refuses child agents on every way of changing a program outage."""

    name = "helpers.outage-access"
    is_safety = True

    def __init__(self, access: ProgramChangeAccess) -> None:
        self.access = access

    def check(self, event: Changed[ProviderOutage], context: Context) -> None:
        self.access.check(context.actor)
