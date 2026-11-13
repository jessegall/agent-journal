from core.modules.plugins.models.enums.run_scope import RunScope
from core.modules.plugins.support.manifest_process_kind import ManifestProcessKind
from core.modules.plugins.support.plugin_kind_pass import PluginKindPass
from core.modules.plugins.support.kind_rule import KindRule
from core.modules.processes.models.process import Process
from engine.enums.command_category import CommandCategory

HEAVY = ManifestProcessKind("heavy", "Heavy", CommandCategory.BUILD, "heavy-at-once", RunScope.PROJECT, memory_mb=600)


def waiting(number: int) -> Process:
    return Process(id=number, plugin="judge", run_name="heavy", environment_id=1, session_agent_id=1, creator_id=1, line="check", folder="/", shell="sh", category=CommandCategory.BUILD, limit_seconds=30)


def category_pass(free: int | None) -> PluginKindPass:
    return PluginKindPass({("judge", "heavy", 1): KindRule(HEAVY, None)}, free, {})


def test_an_admitted_run_takes_its_memory_from_the_free_total_for_the_rest_of_the_pass():
    memory = category_pass(1000)
    assert [memory.is_blocked(waiting(1), ()), memory.is_blocked(waiting(2), ())] == [False, False]
    memory.admitted(waiting(1))
    assert memory.is_blocked(waiting(2), ()) is True


def test_memory_that_is_not_known_holds_no_run_back():
    memory = category_pass(None)
    memory.admitted(waiting(1))
    assert memory.is_blocked(waiting(2), ()) is False
