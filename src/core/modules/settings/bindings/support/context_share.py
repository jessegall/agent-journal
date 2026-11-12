from engine.journal.journal_home import JournalHome
from engine.provider.context_window import ContextWindow
from engine.provider.providers import Providers
from engine.setting.setting_values import SettingValues
from core.modules.settings.support.context_reading import PERCENT_FULL, ContextReading

CONTEXT_LIMIT_ENABLED = "journal.core.helpers.context-limit-on"
CONTEXT_LIMIT_TOKENS = "journal.core.helpers.context-limit-tokens"
CONTEXT_LIMIT_KINDS = "journal.core.helpers.context-limit-kinds"
CONTEXT_LIMIT_PROFILES = "journal.core.helpers.context-limit-profiles"


class ContextShare:
    """How full an agent's context is, in percent: of a limit in tokens while there is one and it comes sooner than
    the program's window, otherwise of the window. The limit is the size set for every agent unless the caller
    names the agent's own."""

    def __init__(self, settings: SettingValues, providers: Providers, home: JournalHome) -> None:
        self.settings, self.providers, self.home = settings, providers, home

    def usage(self, program: str, session: str) -> ContextReading:
        return self.usage_within(program, session, self.limit_tokens())

    def usage_within(self, program: str, session: str, limit: int | None) -> ContextReading:
        return self.reading_within(self.providers.provider(program).context_window(self.home, session), limit)

    def reading(self, window: ContextWindow) -> ContextReading:
        return self.reading_within(window, self.limit_tokens())

    def limit_tokens(self) -> int | None:
        return self.settings.number(CONTEXT_LIMIT_TOKENS) if self.settings.flag(CONTEXT_LIMIT_ENABLED) else None

    def reading_within(self, window: ContextWindow, limit: int | None) -> ContextReading:
        window_percent, tokens = window.used_percentage, window.total_input_tokens
        window_tokens = window.window_size_tokens or self.window_tokens_from_percent(window)
        if tokens is None or limit is None:
            return ContextReading(window_percent, tokens, None, window_tokens)
        limit_percent = tokens * PERCENT_FULL // limit
        percent = limit_percent if window_percent is None else max(limit_percent, window_percent)
        return ContextReading(min(PERCENT_FULL, percent), tokens, limit if window_tokens is None or limit < window_tokens else None, window_tokens)

    @staticmethod
    def window_tokens_from_percent(window: ContextWindow) -> int | None:
        if window.total_input_tokens is None or not window.used_percentage:
            return None
        return window.total_input_tokens * PERCENT_FULL // window.used_percentage

    def percent(self, program: str, session: str) -> int | None:
        return self.usage(program, session).percent

    def maximum_tokens(self, program: str, session: str) -> int | None:
        return self.usage(program, session).maximum_tokens()
