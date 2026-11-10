from engine.journal.journal_home import JournalHome
from engine.provider.context_window import ContextWindow
from engine.provider.providers import Providers
from engine.setting.setting_values import SettingValues
from core.modules.settings.support.context_reading import ContextReading

CONTEXT_LIMIT_ENABLED = "journal.core.helpers.context-limit-on"
CONTEXT_LIMIT_TOKENS = "journal.core.helpers.context-limit-tokens"
PERCENT_FULL = 100


class ContextShare:
    """How full an agent's context is, in percent: of the context limit while that is on and comes sooner than the
    program's window, otherwise of the window."""

    def __init__(self, settings: SettingValues, providers: Providers, home: JournalHome) -> None:
        self.settings, self.providers, self.home = settings, providers, home

    def usage(self, program: str, session: str) -> ContextReading:
        return self.reading(self.providers.provider(program).context_window(self.home, session))

    def reading(self, window: ContextWindow) -> ContextReading:
        window_percent, tokens = window.used_percentage, window.total_input_tokens
        window_tokens = window.window_size_tokens or self.window_tokens_from_percent(window)
        if tokens is None or not self.settings.flag(CONTEXT_LIMIT_ENABLED):
            return ContextReading(window_percent, tokens, None, window_tokens)
        limit = self.settings.number(CONTEXT_LIMIT_TOKENS)
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
        usage = self.usage(program, session)
        return usage.used_tokens * PERCENT_FULL // usage.percent if usage.used_tokens and usage.percent else None
