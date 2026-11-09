from core.base.change.created import Created
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.provider.providers import Providers
from engine.errors.refusal import Refusal
from core.modules.helpers.models.provider_outage import ProviderOutage


class ProviderOutageProgramGuard(Guard[Created[ProviderOutage]]):
    """Only a registered program can receive a new outage."""

    name = "helpers.outage-program"
    is_safety = True

    def __init__(self, providers: Providers) -> None:
        self.providers = providers

    def check(self, event: Created[ProviderOutage], context: Context) -> None:
        if not any(provider.name == event.row.program for provider in self.providers.all()):
            raise Refusal(f"unknown program {event.row.program}", "choose a registered program")
        if event.row.ends_at <= context.timestamp:
            raise Refusal("a program outage needs an end time in the future", "set --ends-at to a future time")
