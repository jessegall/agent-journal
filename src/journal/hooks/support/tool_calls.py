from journal.providers.providers import Providers
from journal.repositories.aliases import Aliases
from journal.support.hook import Hook
from journal.support.tool_call import ToolCall


class ToolCalls:
    """A hook's tool call as its provider decodes it, with the project's aliases, so a part that calls an alias is read as the shell command it stands for."""

    def __init__(self, providers: Providers, aliases: Aliases) -> None:
        self.providers, self.aliases = providers, aliases

    def build(self, hook: Hook) -> ToolCall:
        return self.providers.lookup(hook.provider).call(hook.tool, hook.input, self.aliases.names())
