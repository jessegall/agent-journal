from engine.journal.journal_home import JournalHome
from engine.provider.context_window import ContextWindow
from engine.provider.providers import Providers
from engine.setting.setting_values import SettingValues
from core.modules.settings.support.context_owner import ContextOwner
from core.modules.settings.support.context_reading import PERCENT_FULL, ContextReading

CONTEXT_LIMIT_ENABLED = "journal.core.helpers.context-limit-on"
CONTEXT_LIMIT_TOKENS = "journal.core.helpers.context-limit-tokens"
CONTEXT_LIMIT_KINDS = "journal.core.helpers.context-limit-kinds"
CONTEXT_LIMIT_PROFILES = "journal.core.helpers.context-limit-profiles"
NO_CAP = "none"


class ContextShare:
    """How full an agent's context is, in percent, and the size it is measured against. The size is the
    context size at which that agent is compacted: the entry for its helper type, else the entry for
    its kind of agent, else the size set for every agent; none while the context limit is off or an
    entry says none. The percent is of that size while there is one and it comes sooner than the
    program's window, otherwise of the window."""

    def __init__(self, settings: SettingValues, providers: Providers, home: JournalHome) -> None:
        self.settings, self.providers, self.home = settings, providers, home

    def cap(self, role: str, profile: str) -> int | None:
        if not self.settings.flag(CONTEXT_LIMIT_ENABLED):
            return None
        for key, name in ((CONTEXT_LIMIT_PROFILES, profile), (CONTEXT_LIMIT_KINDS, role)):
            entry = self.entries(key).get(name) if name else None
            if entry is not None:
                return None if entry == NO_CAP else int(entry)
        return self.settings.number(CONTEXT_LIMIT_TOKENS)

    def entries(self, key: str) -> dict[str, str]:
        pairs = (text.rsplit(":", 1) for text in self.settings.texts(key) if ":" in text)
        return {name.strip(): value.strip() for name, value in pairs if value.strip() == NO_CAP or value.strip().isdigit()}

    def usage_of(self, agent: ContextOwner) -> ContextReading:
        return self.usage_within(agent.program, agent.session, self.cap(agent.role, agent.profile))

    def reading_of(self, agent: ContextOwner, window: ContextWindow) -> ContextReading:
        return self.reading_within(window, self.cap(agent.role, agent.profile))

    def percent_of(self, agent: ContextOwner) -> int | None:
        return self.usage_of(agent).percent

    def usage_within(self, program: str, session: str, limit: int | None) -> ContextReading:
        return self.reading_within(self.providers.provider(program).context_window(self.home, session), limit)

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
