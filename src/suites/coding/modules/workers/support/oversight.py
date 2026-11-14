from engine.setting.setting_values import SettingValues
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.support.worker_settings import OVERSIGHT_PROFILES


class Oversight:
    """Whether an agent oversees the workers: its profile is one the oversight profiles setting names, so it may
    read any worker's logs and the merges waiting without marking them read."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def is_overseer(self, agent: Agent) -> bool:
        return agent.profile in self.settings.texts(OVERSIGHT_PROFILES)
