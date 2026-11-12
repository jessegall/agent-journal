from types import SimpleNamespace

import pytest

from core.modules.helpers.support.agent_context_caps import AgentContextCaps
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS, CONTEXT_LIMIT_TOKENS_BY_KIND, CONTEXT_LIMIT_TOKENS_BY_PROFILE

ALL_AGENTS = 400_000


class SettingsSample:
    def __init__(self, enabled: bool = True, by_kind: tuple[str, ...] = (), by_profile: tuple[str, ...] = ()) -> None:
        self.values = {CONTEXT_LIMIT_ENABLED: enabled, CONTEXT_LIMIT_TOKENS: ALL_AGENTS, CONTEXT_LIMIT_TOKENS_BY_KIND: by_kind, CONTEXT_LIMIT_TOKENS_BY_PROFILE: by_profile}

    def flag(self, key: str) -> bool:
        return bool(self.values[key])

    def number(self, key: str) -> int:
        return int(self.values[key])

    def texts(self, key: str) -> tuple[str, ...]:
        return tuple(self.values[key])


def agent(role: str, profile: str = ""):
    return SimpleNamespace(role=role, profile=profile)


CAPS = AgentContextCaps(SettingsSample(by_kind=("main=0", "worker=200000", "helper=300000"), by_profile=("journal-researcher=150000", "journal-planner=0")))


@pytest.mark.parametrize("subject, tokens", [
    (agent("main"), None),
    (agent("worker", "journal-worker"), 200_000),
    (agent("helper", "journal-designer"), 300_000),
    (agent("helper", "journal-researcher"), 150_000),
    (agent("helper", "journal-planner"), None),
    (agent("reviewer", "journal-code-reviewer"), ALL_AGENTS),
], ids=["main capped at none", "worker by its kind", "helper by its kind", "helper type over its kind", "helper type capped at none", "a kind not named"])
def test_each_agent_is_capped_at_its_most_specific_size(subject, tokens):
    assert CAPS.tokens(subject) == tokens


def test_with_the_limit_off_no_agent_is_capped():
    assert AgentContextCaps(SettingsSample(enabled=False, by_kind=("worker=200000",))).tokens(agent("worker")) is None
