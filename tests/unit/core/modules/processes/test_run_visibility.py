from types import SimpleNamespace

from core.modules.processes.support.run_visibility import RunVisibility

PART = SimpleNamespace(is_visible=True)


def test_a_service_of_a_plugin_has_no_visible_part_and_an_agents_own_run_has_one():
    assert RunVisibility.select_visible_part(SimpleNamespace(plugin="code-commandments", creator_id=1, session_agent_id=2), tuple([PART])) is None
    assert RunVisibility.select_visible_part(SimpleNamespace(plugin="", creator_id=2, session_agent_id=2), tuple([PART])) is PART
