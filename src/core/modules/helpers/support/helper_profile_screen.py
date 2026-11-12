from core.modules.helpers.support.helper_settings import (CONTEXT_LIMIT_PROFILES, CONTEXT_LIMIT_TOKENS, HELPER_KEPT_LIMIT, HELPER_MAX_COST, HELPER_MAX_MINUTES, HELPER_PROFILE_LIMITS,
                                                          HELPER_RUN_LIMIT)
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.settings.support.setting_screen import ScreenNode, ScreenReading
from engine.enums.setting_component import SettingComponent
from engine.types.type_guards import is_list, is_tuple

EVERY_PROFILE = "Every profile"
OWN_VALUE = "Own value"
SECTIONS = {"running": "How many", "kept": "How many", "cap": "Context cap", "minutes": "Limits on one job", "cost": "Limits on one job"}


class HelperProfileScreen:
    """Reads the screen of one read-only helper profile: each limit the Read-only helpers line sets for every
    profile, with the value the profile itself keeps, and which of the two it holds now. The value of the line
    is never changed by a profile's own value, and a profile's own value never follows the line."""

    def __init__(self, reader: SettingReader) -> None:
        self.reader = reader

    def read(self, profile: str) -> ScreenReading:
        own_limits = self.entries(HELPER_PROFILE_LIMITS, profile)
        own_run, own_kept = (int(number) for number in own_limits[:2]) if len(own_limits) == 2 and all(number.isdigit() for number in own_limits) else (None, None)
        own_cap = self.entries(CONTEXT_LIMIT_PROFILES, profile)
        nodes = (
            self.node(HELPER_RUN_LIMIT, "running", own_run, SettingComponent.PER_TYPE_OVERRIDE),
            self.node(HELPER_KEPT_LIMIT, "kept", own_kept, SettingComponent.PER_TYPE_OVERRIDE),
            self.node(CONTEXT_LIMIT_TOKENS, "cap", int(own_cap[0]) if own_cap and own_cap[0].isdigit() else None, SettingComponent.THREE_WAY_CAP),
            self.node(HELPER_MAX_MINUTES, "minutes", None, SettingComponent.PER_TYPE_OVERRIDE),
            self.node(HELPER_MAX_COST, "cost", None, SettingComponent.PER_TYPE_OVERRIDE))
        return ScreenReading(f"helper-type.{profile}", ScreenReading.revision_of(nodes), nodes)

    def entries(self, key: str, profile: str) -> list[str]:
        stored = self.reader.current(key).value
        for item in stored if is_list(stored) or is_tuple(stored) else ():
            name, _, numbers = str(item).partition(":")
            if name == profile:
                return numbers.split(":")
        return []

    def node(self, key: str, section: str, own: int | None, component: SettingComponent) -> ScreenNode:
        every = self.reader.current(key)
        entry = every.entry
        return ScreenNode(key, entry.type, component.value, SECTIONS[section], entry.parent, entry.title, entry.description, every.value if own is None else own, entry.default,
                          EVERY_PROFILE if own is None else OWN_VALUE, tuple(entry.choices), entry.rule, tuple(entry.required_settings), entry.person_set)
