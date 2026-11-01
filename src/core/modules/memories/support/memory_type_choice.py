from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.memories.models.memory_type import MemoryType
from core.modules.memories.models.memory_type_switch import MemoryTypeSwitch
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.memories.support.memory_settings import TYPE_SETTINGS

ALL_SUITES = "*"


class MemoryTypeChoice:
    """Whether a memory type is on in an environment: its type setting there, then the
    project's, then the switch for the environment's suite, then the switch for every suite, else off."""

    def __init__(self, settings: SettingValues, suites: SuiteChoice, queries: Queries, kept: KeptRows) -> None:
        self.settings, self.suites, self.queries, self.kept = settings, suites, queries, kept

    def enabled(self, type_name: str, environment_id: int | None) -> bool:
        setting = self.settings.value(f"{TYPE_SETTINGS}{type_name}", environment_id)
        if isinstance(setting, bool):
            return setting
        switches = {switch.suite: switch.enabled for switch in self.switch_rows() if switch.type == type_name}
        suite = self.suites.suite(environment_id) if environment_id is not None else None
        if suite is not None and suite.name in switches:
            return switches[suite.name]
        return switches.get(ALL_SUITES, False)

    def enabled_types(self, environment_id: int | None) -> tuple[str, ...]:
        return tuple(memory_type.name for memory_type in self.type_rows() if self.enabled(memory_type.name, environment_id))

    def type_rows(self) -> list[MemoryType]:
        return list(self.kept.read("memory_types", lambda: tuple(self.queries.query(MemoryType).all_rows())))

    def switch_rows(self) -> list[MemoryTypeSwitch]:
        return list(self.kept.read("memory_type_switches", lambda: tuple(self.queries.query(MemoryTypeSwitch).all_rows())))
