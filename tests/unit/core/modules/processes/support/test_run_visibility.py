from types import SimpleNamespace

from engine.enums.command_category import CommandCategory
from core.modules.processes.support.run_visibility import RunVisibility

PART = SimpleNamespace(is_visible=True)
SCRIPT = SimpleNamespace(is_visible=False, category=CommandCategory.PROCESS)
LISTING = SimpleNamespace(is_visible=False, category=CommandCategory.READ)
MOVED_AT = "2026-11-11T20:00:00+00:00"


def run(creator_id: int = 2, moved_at: str | None = None, plugin: str = "") -> SimpleNamespace:
    return SimpleNamespace(plugin=plugin, creator_id=creator_id, session_agent_id=2, moved_at=moved_at)


def test_a_service_of_a_plugin_has_no_visible_part_and_an_agents_own_run_has_one():
    assert RunVisibility.select_visible_part(run(creator_id=1, plugin="code-commandments"), tuple([PART])) is None
    assert RunVisibility.select_visible_part(run(), tuple([PART])) is PART


def test_an_agents_own_script_shows_once_it_moved_to_the_background_and_not_before():
    assert RunVisibility.select_visible_part(run(moved_at=MOVED_AT), tuple([SCRIPT])) is SCRIPT
    assert RunVisibility.select_visible_part(run(), tuple([SCRIPT])) is None


def test_a_moved_plugin_run_and_a_moved_listing_do_not_show():
    assert RunVisibility.select_visible_part(run(moved_at=MOVED_AT, plugin="code-commandments"), tuple([SCRIPT])) is None
    assert RunVisibility.select_visible_part(run(moved_at=MOVED_AT), tuple([LISTING])) is None


def test_a_run_another_agent_created_shows_its_first_part_without_moving():
    assert RunVisibility.select_visible_part(run(creator_id=1), tuple([SCRIPT])) is SCRIPT
