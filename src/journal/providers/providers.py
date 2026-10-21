from collections.abc import Mapping

from journal.providers.claude import Claude
from journal.providers.codex import Codex
from journal.providers.provider import Provider
from journal.support.caller import Caller
from journal.support.hook import Hook
from journal.support.tool_call import ToolCall
from journal.support.caller_variables import CallerVariables


class Providers:
    """Every provider by name, and what their variables say about a shell: whose session it is, which provider marks it and whether an agent runs in it."""

    def __init__(self) -> None:
        self._by_name: dict[str, Provider] = {provider.name: provider for provider in (Claude(), Codex())}

    def lookup(self, name: str) -> Provider:
        return self._by_name[name]

    def hook_call(self, hook: Hook) -> ToolCall:
        return self.lookup(hook.provider).call(hook.tool, hook.input)

    def default(self) -> Provider:
        return next(provider for provider in self._by_name.values() if provider.default)

    def all(self) -> list[Provider]:
        return list(self._by_name.values())

    def inherited_markers(self) -> tuple[str, ...]:
        return tuple(marker for provider in self.all() for marker in provider.inherited_markers)

    def session_variables(self) -> tuple[str, ...]:
        return tuple(provider.session_variable for provider in self.all() if provider.session_variable)

    def shell_provider(self, environ: Mapping[str, str]) -> Provider:
        return next((provider for provider in self.all() if any(environ.get(marker) for marker in provider.inherited_markers)), self.default())

    def caller_variables(self, environ: Mapping[str, str]) -> CallerVariables:
        provider = self.shell_provider(environ)
        return CallerVariables.read(environ, provider.name, tuple(name for name in (provider.session_variable,) if name), self.inherited_markers())

    def caller(self, environ: Mapping[str, str]) -> Caller:
        return self.caller_variables(environ).caller()
