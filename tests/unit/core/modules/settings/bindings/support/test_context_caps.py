from core.modules.settings.bindings.support.context_share import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_KINDS, CONTEXT_LIMIT_PROFILES, CONTEXT_LIMIT_TOKENS, ContextShare
from suites.coding.support.shipped_profiles import PLANNER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE


class Settings:
    """Setting values held in a dictionary."""

    def __init__(self, values: dict[str, object]) -> None:
        self.values = values

    def flag(self, key: str) -> bool:
        return bool(self.values.get(key, False))

    def number(self, key: str) -> int:
        return int(self.values.get(key, 0))

    def texts(self, key: str) -> tuple[str, ...]:
        return tuple(self.values.get(key, ()))


def caps(**values: object) -> ContextShare:
    return ContextShare(Settings({CONTEXT_LIMIT_ENABLED: True, CONTEXT_LIMIT_TOKENS: 400000,
                                 CONTEXT_LIMIT_KINDS: ("worker:200000", "main:none"), CONTEXT_LIMIT_PROFILES: tuple([f"{PLANNER_PROFILE.name}:150000"]), **values}), None, None)


def test_a_worker_is_capped_while_the_main_agent_is_not():
    assert (caps().cap("worker", ""), caps().cap("main", "")) == (200000, None)


def test_a_helper_type_entry_wins_over_its_kind_and_an_unlisted_kind_uses_the_size_for_every_agent():
    assert (caps().cap("helper", f"{PLANNER_PROFILE.name}"), caps().cap("helper", f"{RESEARCHER_PROFILE.name}")) == (150000, 400000)


def test_no_agent_is_capped_while_the_context_limit_is_off():
    assert caps(**{CONTEXT_LIMIT_ENABLED: False}).cap("worker", "") is None
