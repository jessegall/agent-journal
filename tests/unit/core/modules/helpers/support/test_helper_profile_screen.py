from core.modules.helpers.support.helper_profile_screen import ALL_PROFILES_SOURCE, PROFILE_VALUE_SOURCE, HelperProfileScreen
from core.modules.helpers.support.helper_settings import (CONTEXT_LIMIT_PROFILES, CONTEXT_LIMIT_TOKENS, HELPER_KEPT_LIMIT, HELPER_MAX_COST, HELPER_MAX_MINUTES, HELPER_PROFILE_LIMITS,
                                                          HELPER_RUN_LIMIT)
from core.modules.settings.support.current_setting import CurrentSetting
from engine.registry.setting_entry import SettingEntry
from suites.coding.support.shipped_profiles import PLANNER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

KEYS = (HELPER_RUN_LIMIT, HELPER_KEPT_LIMIT, HELPER_PROFILE_LIMITS, CONTEXT_LIMIT_TOKENS, CONTEXT_LIMIT_PROFILES, HELPER_MAX_MINUTES, HELPER_MAX_COST)


class FakeReader:
    def __init__(self, values: dict[str, object]) -> None:
        self.values = values

    def current(self, key: str) -> CurrentSetting:
        entry = SettingEntry(key, "journal.core.helpers", None, key, "A setting.", "number", 1, False, "both", (), False, True)
        return CurrentSetting(entry, self.values.get(key, 4), "default")


def nodes(values: dict[str, object]) -> dict[str, object]:
    return {node.key: node for node in HelperProfileScreen(FakeReader(values)).read(f"{RESEARCHER_PROFILE.name}").nodes}


def test_a_profile_without_its_own_limits_shows_the_value_of_every_profile():
    found = nodes({HELPER_RUN_LIMIT: 4, HELPER_KEPT_LIMIT: 8, HELPER_PROFILE_LIMITS: ()})
    assert (found[HELPER_RUN_LIMIT].source, found[HELPER_RUN_LIMIT].value, found[HELPER_KEPT_LIMIT].value) == (ALL_PROFILES_SOURCE, 4, 8)


def test_a_profile_with_its_own_limits_shows_them_as_its_own_value():
    found = nodes({HELPER_RUN_LIMIT: 4, HELPER_KEPT_LIMIT: 8, HELPER_PROFILE_LIMITS: (f"{RESEARCHER_PROFILE.name}:1:3", f"{PLANNER_PROFILE.name}:2:2")})
    assert (found[HELPER_RUN_LIMIT].source, found[HELPER_RUN_LIMIT].value, found[HELPER_KEPT_LIMIT].value) == (PROFILE_VALUE_SOURCE, 1, 3)


def test_changing_the_value_of_every_profile_leaves_the_own_value_of_a_profile_unchanged():
    own = tuple([f"{RESEARCHER_PROFILE.name}:1:3"])
    before = nodes({HELPER_RUN_LIMIT: 4, HELPER_KEPT_LIMIT: 8, HELPER_PROFILE_LIMITS: own})
    after = nodes({HELPER_RUN_LIMIT: 9, HELPER_KEPT_LIMIT: 20, HELPER_PROFILE_LIMITS: own})
    assert (before[HELPER_RUN_LIMIT].value, after[HELPER_RUN_LIMIT].value, after[HELPER_RUN_LIMIT].source) == (1, 1, PROFILE_VALUE_SOURCE)


def test_a_profile_cap_of_its_own_replaces_the_default_cap_and_says_so():
    found = nodes({CONTEXT_LIMIT_TOKENS: 400000, CONTEXT_LIMIT_PROFILES: tuple([f"{RESEARCHER_PROFILE.name}:150000"])})
    assert (found[CONTEXT_LIMIT_TOKENS].value, found[CONTEXT_LIMIT_TOKENS].source, found[CONTEXT_LIMIT_TOKENS].component) == (150000, PROFILE_VALUE_SOURCE, "three-way-cap")
