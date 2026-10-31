from collections.abc import Sequence

from core.base.module.module import Module
from core.base.registry.dotted_path import DottedPath
from core.base.registry.provider_entry import ProviderEntry


class ProviderEntries:
    """The registry entries of the agent programs the modules add, in sync order."""

    def providers(self, modules: Sequence[type[Module]]) -> tuple[ProviderEntry, ...]:
        return tuple(ProviderEntry(provider.name, DottedPath.class_path(provider), module.name, provider.title) for module in modules for provider in module.providers)
