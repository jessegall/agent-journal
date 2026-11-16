from engine.enums.command_category import CommandCategory
from engine.enums.execution_length import ExecutionLength
from engine.enums.execution_priority import ExecutionPriority
from core.modules.plugins.support.manifest_run_type import ManifestRunType
from core.modules.plugins.support.plugin_run_start_check import PluginRunStartCheck
from core.modules.plugins.support.plugin_run_rule import PluginRunRule


def category_rule(name: str, limit: int | None) -> PluginRunRule:
    return PluginRunRule(ManifestRunType(name, name, CommandCategory.CHECK, "concurrent"), limit)


def test_declared_kind_becomes_a_class_with_the_manifest_limit():
    classes = PluginRunStartCheck({("sample", "judge", 1): category_rule("judge", 1)}, 0, {}).category_class_map()
    judge = classes[("sample", "judge")]
    assert (judge.pool, judge.slot_cost, judge.priority, judge.class_limit, judge.plugin) == (ExecutionLength.LONG, 4, ExecutionPriority.NORMAL, 1, "sample")


def test_a_plugin_named_like_a_journal_kind_keeps_its_own_class():
    classes = PluginRunStartCheck({("sample", "merge", 1): category_rule("merge", None)}, 0, {}).category_class_map()
    assert classes[("sample", "merge")].name == "sample merge" and classes[("sample", "merge")].plugin == "sample"
