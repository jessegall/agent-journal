from core.base.journal_home import JournalHome
from core.base.provider.providers import Providers
from core.modules.settings.bindings.support.setting_values import SettingValues

CONTEXT_LIMIT_ON = "journal.core.helpers.context-limit-on"
CONTEXT_LIMIT_TOKENS = "journal.core.helpers.context-limit-tokens"
WHOLE = 100


class ContextShare:
    """How full an agent's context is, in percent: of the context limit while that is on and comes sooner than the
    program's window, otherwise of the window."""

    def __init__(self, settings: SettingValues, providers: Providers, home: JournalHome) -> None:
        self.settings, self.providers, self.home = settings, providers, home

    def percent(self, program: str, session: str) -> int | None:
        provider = self.providers.provider(program)
        window_percent = provider.context_percent(self.home, session)
        tokens = provider.context_tokens(self.home, session)
        if tokens is None or not self.settings.flag(CONTEXT_LIMIT_ON):
            return window_percent
        return min(WHOLE, max(tokens * WHOLE // self.settings.number(CONTEXT_LIMIT_TOKENS), window_percent or 0))

    def maximum_tokens(self, program: str, session: str) -> int | None:
        tokens = self.providers.provider(program).context_tokens(self.home, session)
        percent = self.percent(program, session)
        return tokens * WHOLE // percent if tokens and percent else None
