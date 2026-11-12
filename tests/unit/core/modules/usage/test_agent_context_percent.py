from types import SimpleNamespace

from engine.provider.context_window import ContextWindow
from core.modules.settings.bindings.support.context_share import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_KINDS, CONTEXT_LIMIT_PROFILES, CONTEXT_LIMIT_TOKENS, ContextShare
from core.modules.usage.commands.usage_agents.usage_agents_subcommand import UsageAgentsSubcommand
from core.modules.usage.support.session_status import SessionStatus

WINDOW_PERCENT = 8


class Settings:
    def __init__(self, enabled: bool) -> None:
        self.values = {CONTEXT_LIMIT_ENABLED: enabled, CONTEXT_LIMIT_TOKENS: 400000,
                       CONTEXT_LIMIT_KINDS: ("worker:300000", "main:none"), CONTEXT_LIMIT_PROFILES: ("journal-planner:150000",)}

    def flag(self, key: str) -> bool:
        return bool(self.values[key])

    def number(self, key: str) -> int:
        return int(self.values[key])

    def texts(self, key: str) -> tuple[str, ...]:
        return tuple(self.values[key])


def percent(role: str, profile: str, tokens: int, enabled: bool = True) -> int | None:
    settings = Settings(enabled)
    subcommand = UsageAgentsSubcommand.__new__(UsageAgentsSubcommand)
    subcommand.share = ContextShare(settings, None, None)
    subcommand.is_context_unknown = lambda card, status: False
    card = SimpleNamespace(role=role, profile=profile)
    return subcommand.context_percent(card, SessionStatus(model="m", context_percent=WINDOW_PERCENT, context_tokens=tokens))


def test_a_planner_with_its_own_cap_shows_the_percent_of_that_cap():
    assert percent("helper", "journal-planner", 75000) == 50


def test_a_kind_cap_applies_to_a_type_without_its_own():
    assert percent("worker", "journal-medior", 75000) == 25


def test_the_size_for_every_agent_applies_to_a_kind_without_an_entry():
    assert percent("helper", "journal-researcher", 100000) == 25


def test_an_agent_with_no_cap_shows_the_percent_of_its_program_window():
    assert percent("main", "", 75000) == WINDOW_PERCENT


def test_no_agent_is_measured_against_a_cap_while_the_context_limit_is_off():
    assert percent("helper", "journal-planner", 75000, enabled=False) == WINDOW_PERCENT
