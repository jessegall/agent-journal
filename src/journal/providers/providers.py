from journal.providers.claude import Claude
from journal.providers.codex import Codex
from journal.providers.provider import Provider


class Providers:
    """Every provider by name."""

    def __init__(self) -> None:
        self._by_name: dict[str, Provider] = {provider.name: provider for provider in (Claude(), Codex())}

    def named(self, name: str) -> Provider:
        return self._by_name[name]
