from core.base.query.queries import Queries
from core.modules.drivers.suite_choice import SuiteChoice
from core.modules.memories.memory_type import MemoryType
from core.modules.memories.memory_type_switch import MemoryTypeSwitch
from core.modules.settings.setting_values import SettingValues

EVERY_SUITE = "*"


class MemoryTypeChoice:
    """Whether a memory type is on in an environment: its setting memories.type.<name> there, then the project's,
    then the switch for the environment's suite, then the switch for every suite, else off."""

    def __init__(self, settings: SettingValues, suites: SuiteChoice, queries: Queries) -> None:
        self.settings, self.suites, self.queries = settings, suites, queries

    def on(self, type_name: str, environment_id: int | None) -> bool:
        key = f"memories.type.{type_name}"
        setting = self.settings.project_value(key, None) if environment_id is None else self.settings.value(key, environment_id, None)
        if isinstance(setting, bool):
            return setting
        switches = {switch.suite: switch.is_on for switch in self.queries.query(MemoryTypeSwitch).filter(type=type_name).all_rows()}
        suite = self.suites.suite(environment_id) if environment_id is not None else None
        if suite is not None and suite.name in switches:
            return switches[suite.name]
        return switches.get(EVERY_SUITE, False)

    def on_types(self, environment_id: int | None) -> tuple[str, ...]:
        return tuple(memory_type.name for memory_type in self.queries.query(MemoryType).all_rows() if self.on(memory_type.name, environment_id))
