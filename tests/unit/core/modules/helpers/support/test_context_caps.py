from types import SimpleNamespace

from core.modules.helpers.support.context_caps import ContextCaps
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_KINDS, CONTEXT_LIMIT_PROFILES, CONTEXT_LIMIT_TOKENS


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


def caps(**values: object) -> ContextCaps:
    return ContextCaps(Settings({CONTEXT_LIMIT_ENABLED: True, CONTEXT_LIMIT_TOKENS: 400000,
                                 CONTEXT_LIMIT_KINDS: ("worker:200000", "main:none"), CONTEXT_LIMIT_PROFILES: ("journal-planner:150000",), **values}))


def agent(role: str, profile: str = "") -> SimpleNamespace:
    return SimpleNamespace(role=role, profile=profile)


def test_a_worker_is_capped_while_the_main_agent_is_not():
    assert (caps().tokens(agent("worker")), caps().tokens(agent("main"))) == (200000, None)


def test_a_helper_type_entry_wins_over_its_kind_and_an_unlisted_kind_uses_the_size_for_every_agent():
    assert (caps().tokens(agent("helper", "journal-planner")), caps().tokens(agent("helper", "journal-researcher"))) == (150000, 400000)


def test_no_agent_is_capped_while_the_context_limit_is_off():
    assert caps(**{CONTEXT_LIMIT_ENABLED: False}).tokens(agent("worker")) is None
