from core.base.journal_home import JournalHome
from core.base.provider.providers import Providers
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.settings.support.context_reading import ContextReading

CONTEXT_LIMIT_ON = "journal.core.helpers.context-limit-on"
CONTEXT_LIMIT_TOKENS = "journal.core.helpers.context-limit-tokens"
WHOLE = 100


class ContextShare:
    """How full an agent's context is, in percent: of the context limit while that is on and comes sooner than the
    program's window, otherwise of the window."""

    def __init__(self, settings: SettingValues, providers: Providers, home: JournalHome) -> None:
        self.settings, self.providers, self.home = settings, providers, home

    def reading(self, program: str, session: str) -> ContextReading:
        provider = self.providers.provider(program)
        window_percent = provider.context_percent(self.home, session)
        tokens = provider.context_tokens(self.home, session)
        if tokens is None or not self.settings.flag(CONTEXT_LIMIT_ON):
            return ContextReading(window_percent, tokens, None)
        limit = self.settings.number(CONTEXT_LIMIT_TOKENS)
        window_tokens = tokens * WHOLE // window_percent if window_percent else None
        return ContextReading(min(WHOLE, max(tokens * WHOLE // limit, window_percent or 0)), tokens, limit if window_tokens is None or limit < window_tokens else None)

    def percent(self, program: str, session: str) -> int | None:
        return self.reading(program, session).percent

    def maximum_tokens(self, program: str, session: str) -> int | None:
        reading = self.reading(program, session)
        return reading.used_tokens * WHOLE // reading.percent if reading.used_tokens and reading.percent else None
