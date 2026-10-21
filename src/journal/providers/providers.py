from journal.providers.claude import Claude
from journal.providers.codex import Codex
from journal.providers.provider import Provider
from journal.support.caller import AGENT_SHELL, Caller


class Providers:
    """Every provider by name, and what their variables say about a shell: whose session it is and whether an agent runs in it."""

    def __init__(self) -> None:
        self._by_name: dict[str, Provider] = {provider.name: provider for provider in (Claude(), Codex())}

    def lookup(self, name: str) -> Provider:
        return self._by_name[name]

    def all(self) -> list[Provider]:
        return list(self._by_name.values())

    def inherited_markers(self) -> tuple[str, ...]:
        return tuple(marker for provider in self.all() for marker in provider.inherited_markers)

    def session_variables(self) -> tuple[str, ...]:
        return tuple(provider.session_variable for provider in self.all() if provider.session_variable)

    def caller(self, environ: dict) -> Caller:
        session = next((environ[name] for name in ("JOURNAL_SESSION", *self.session_variables()) if environ.get(name)), "")
        agent_shell = any(environ.get(name) for name in (*self.inherited_markers(), AGENT_SHELL))
        return Caller(environ.get("JOURNAL_ENV", "main"), session, agent_shell, environ.get("JOURNAL_PLUGIN", ""))
