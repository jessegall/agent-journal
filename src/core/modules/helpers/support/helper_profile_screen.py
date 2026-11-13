from core.modules.helpers.support.helper_settings import (CONTEXT_LIMIT_PROFILES, CONTEXT_LIMIT_TOKENS, HELPER_KEPT_LIMIT, HELPER_MAX_COST, HELPER_MAX_MINUTES, HELPER_PROFILE_LIMITS,
                                                          HELPER_RUN_LIMIT)
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.settings.support.screen_reading import ScreenReading
from core.modules.settings.support.screen_node import ScreenNode
from engine.enums.setting_component import SettingComponent
from engine.types.type_guards import is_list, is_tuple

ALL_PROFILES_SOURCE = "Every profile"
PROFILE_VALUE_SOURCE = "Own value"
SECTIONS = {"running": "How many", "kept": "How many", "cap": "Context cap", "minutes": "Limits on one job", "cost": "Limits on one job"}


class HelperProfileScreen:
    """Reads the screen of one read-only helper profile: each limit the Read-only helpers line sets for every
    profile, with the value the profile itself keeps, and which of the two it holds now. The value of the line
    is never changed by a profile's own value, and a profile's own value never follows the line."""

    def __init__(self, reader: SettingReader) -> None:
        self.reader = reader

    def read(self, profile: str) -> ScreenReading:
        profile_limits = self.entries(HELPER_PROFILE_LIMITS, profile)
        profile_run, profile_kept = (int(number) for number in profile_limits[:2]) if len(profile_limits) == 2 and all(number.isdigit() for number in profile_limits) else (None, None)
        profile_cap = self.entries(CONTEXT_LIMIT_PROFILES, profile)
        nodes = (
            self.node(HELPER_RUN_LIMIT, "running", profile_run, SettingComponent.TYPE_OVERRIDE),
            self.node(HELPER_KEPT_LIMIT, "kept", profile_kept, SettingComponent.TYPE_OVERRIDE),
            self.node(CONTEXT_LIMIT_TOKENS, "cap", int(profile_cap[0]) if profile_cap and profile_cap[0].isdigit() else None, SettingComponent.TRIPLE_CAP),
            self.node(HELPER_MAX_MINUTES, "minutes", None, SettingComponent.TYPE_OVERRIDE),
            self.node(HELPER_MAX_COST, "cost", None, SettingComponent.TYPE_OVERRIDE))
        return ScreenReading(f"helper-type.{profile}", ScreenReading.revision_of(nodes), nodes)

    def entries(self, key: str, profile: str) -> list[str]:
        stored = self.reader.current(key).value
        for item in stored if is_list(stored) or is_tuple(stored) else ():
            name, _, numbers = str(item).partition(":")
            if name == profile:
                return numbers.split(":")
        return []

    def node(self, key: str, section: str, profile_value: int | None, component: SettingComponent) -> ScreenNode:
        shared_setting = self.reader.current(key)
        entry = shared_setting.entry
        return ScreenNode(key, entry.type, component.value, SECTIONS[section], entry.parent, entry.title, entry.description, shared_setting.value if profile_value is None else profile_value, entry.default,
                          ALL_PROFILES_SOURCE if profile_value is None else PROFILE_VALUE_SOURCE, tuple(entry.choices), entry.rule, tuple(entry.required_settings), entry.person_set)
