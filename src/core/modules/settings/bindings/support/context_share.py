from engine.journal.journal_home import JournalHome
from engine.provider.context_window import ContextWindow
from engine.provider.providers import Providers
from engine.setting.setting_values import SettingValues
from core.modules.settings.bindings.support.context_caps import ContextCaps
from core.modules.settings.support.context_reading import PERCENT_FULL, ContextReading


class ContextShare:
    """How full an agent's context is, in percent: of the agent's own context cap (ContextCaps, from its kind and
    helper type) while one is set and comes sooner than the program's window, otherwise of the window."""

    def __init__(self, settings: SettingValues, providers: Providers, home: JournalHome, caps: ContextCaps) -> None:
        self.settings, self.providers, self.home, self.caps = settings, providers, home, caps

    def usage(self, program: str, session: str, role: str = "", profile: str = "") -> ContextReading:
        return self.reading(self.providers.provider(program).context_window(self.home, session), role, profile)

    def reading(self, window: ContextWindow, role: str = "", profile: str = "") -> ContextReading:
        window_percent, tokens = window.used_percentage, window.total_input_tokens
        window_tokens = window.window_size_tokens or self.window_tokens_from_percent(window)
        limit = None if tokens is None else self.caps.tokens(role, profile)
        if tokens is None or not limit:
            return ContextReading(window_percent, tokens, None, window_tokens)
        limit_percent = tokens * PERCENT_FULL // limit
        percent = limit_percent if window_percent is None else max(limit_percent, window_percent)
        return ContextReading(min(PERCENT_FULL, percent), tokens, limit if window_tokens is None or limit < window_tokens else None, window_tokens)

    @staticmethod
    def window_tokens_from_percent(window: ContextWindow) -> int | None:
        if window.total_input_tokens is None or not window.used_percentage:
            return None
        return window.total_input_tokens * PERCENT_FULL // window.used_percentage

    def percent(self, program: str, session: str, role: str = "", profile: str = "") -> int | None:
        return self.usage(program, session, role, profile).percent

    def maximum_tokens(self, program: str, session: str, role: str = "", profile: str = "") -> int | None:
        return self.usage(program, session, role, profile).maximum_tokens()
