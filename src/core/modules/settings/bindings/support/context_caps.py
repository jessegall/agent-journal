from engine.setting.setting_values import SettingValues

CONTEXT_LIMIT_ENABLED = "journal.core.helpers.context-limit-on"
CONTEXT_LIMIT_TOKENS = "journal.core.helpers.context-limit-tokens"
CONTEXT_LIMIT_KINDS = "journal.core.helpers.context-limit-kinds"
CONTEXT_LIMIT_PROFILES = "journal.core.helpers.context-limit-profiles"
NO_CAP = "none"


class ContextCaps:
    """The context size at which an agent is compacted: the entry for its helper type, else the entry for its kind
    of agent, else the size set for every agent; none while the context limit is off or an entry says none."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def tokens(self, role: str, profile: str = "") -> int | None:
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
