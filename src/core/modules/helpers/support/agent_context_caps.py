from engine.setting.setting_values import SettingValues
from core.modules.agents.models.agent import Agent
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS, CONTEXT_LIMIT_TOKENS_BY_KIND, CONTEXT_LIMIT_TOKENS_BY_PROFILE

NAME_SEPARATOR = "="


class AgentContextCaps:
    """The context size one agent is compacted at, the most specific value first: its helper type's own size, else
    its kind's, else the one size for all agents. A size of 0 caps that agent at none; with the limit off none is
    capped."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def tokens(self, agent: Agent) -> int | None:
        if not self.settings.flag(CONTEXT_LIMIT_ENABLED):
            return None
        for key, name in ((CONTEXT_LIMIT_TOKENS_BY_PROFILE, agent.profile), (CONTEXT_LIMIT_TOKENS_BY_KIND, agent.role)):
            sizes = self.named_sizes(key)
            if name and name in sizes:
                return sizes[name] or None
        return self.settings.number(CONTEXT_LIMIT_TOKENS)

    def named_sizes(self, key: str) -> dict[str, int]:
        sizes: dict[str, int] = {}
        for line in self.settings.texts(key):
            name, separator, size = line.partition(NAME_SEPARATOR)
            if separator and size.strip().isdigit():
                sizes[name.strip()] = int(size.strip())
        return sizes
