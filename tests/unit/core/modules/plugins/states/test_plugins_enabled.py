from types import SimpleNamespace

from engine.driver.open_row import OpenRow
from engine.enums.state_tier import StateTier
from engine.time.timestamp import Timestamp
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.rules.plugin_rule import PluginRule
from core.modules.plugins.states.plugins_enabled import PluginsEnabled

CREATED = Timestamp.parsed("2026-11-14T07:00:00+00:00")
HOOK = SimpleNamespace(agent_id=7, event=SimpleNamespace(event="pre_tool_use", tool=None, raw={}, prompt="", accepts_lines=True))


class Untouched:
    """Stands for anything the rule would only reach for a plugin that is switched on: any use fails."""


def enabled(plugins: list[Plugin]) -> SimpleNamespace:
    return SimpleNamespace(enabled_plugins=lambda: list(plugins))


def plugin() -> Plugin:
    return Plugin(id=3, version=1, created_at=CREATED, updated_at=CREATED, creator_id=1, name="ledger", title="Ledger", source="/sources/ledger", release="1.0.0", enabled=True)


def test_the_state_is_asked_in_place_for_the_plugin_role_and_gates_the_plugin_rule():
    assert (PluginsEnabled.name, PluginsEnabled.tier, PluginsEnabled.rules) == ("plugins.enabled", StateTier.IN_PLACE, [PluginRule])


def test_with_no_plugin_switched_on_the_state_is_closed_and_the_rule_answers_allowed_with_nothing_to_run():
    assert PluginsEnabled(enabled([])).open_rows(HOOK) == []
    runs = SimpleNamespace(hook_facts=lambda agent_id: None)
    answer = PluginRule(SimpleNamespace(checks=lambda: []), Untouched(), runs, Untouched(), Untouched(), Untouched()).answer(HOOK)
    assert (answer.refusal, tuple(answer.nudges), tuple(answer.commands)) == ("", (), ())


def test_a_plugin_switched_on_opens_the_state_on_it():
    assert PluginsEnabled(enabled([plugin()])).open_rows(HOOK) == [OpenRow("plugin", 3, CREATED)]
