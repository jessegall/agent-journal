import pytest

from core.base.module.layer import Layer
from core.base.module.layer_check import LayerCheck
from core.base.module.layer_rules import LayerRules
from core.base.module.layer_table import LayerTable
from core.base.module.layer_tier import LayerTier
from core.base.module.module import Module


def declared(name, folder, dependencies=()):
    class DeclaredModule(Module):
        pass

    DeclaredModule.name = f"journal.{name}"
    DeclaredModule.dependencies = [f"journal.{dependency}" for dependency in dependencies]
    DeclaredModule.__module__ = f"{folder}.{name}_module"
    return DeclaredModule


def module_folder(project, folder, name, source=""):
    target = project / "src" / folder.replace(".", "/")
    target.mkdir(parents=True, exist_ok=True)
    (target / f"{name}_module.py").write_text(source)


def failures(project, *modules):
    return LayerCheck(project, LayerTable(), modules).failures()


@pytest.mark.parametrize("path,layer", [
    ("src/core/base/clock.py", Layer(LayerTier.ENGINE, "engine")),
    ("src/core/modules/tasks/models/task.py", Layer(LayerTier.CORE_MODULE, "tasks")),
    ("src/suites/coding/coding_module.py", Layer(LayerTier.SUITE, "coding")),
    ("src/suites/coding/modules/workers/workers_module.py", Layer(LayerTier.SUITE_MODULE, "coding/workers")),
    ("src/tunnels/tunler/tunler_module.py", Layer(LayerTier.TUNNEL, "tunler")),
    ("src/server/viewer/page.py", Layer(LayerTier.HOST, "server")),
    ("src/install/hook_switch.py", Layer(LayerTier.HOST, "install")),
])
def test_a_path_gives_its_layer(path, layer):
    assert LayerTable().file_layer(path) == layer


def test_a_path_that_matches_no_pattern_has_no_layer():
    assert LayerTable().file_layer("src/core/journal.py") is None


def test_a_file_in_no_layer_fails(tmp_path):
    (tmp_path / "src" / "stray").mkdir(parents=True)
    (tmp_path / "src" / "stray" / "loose.py").write_text("")
    assert failures(tmp_path) == ["src/stray/loose.py: the file is in no layer"]


def test_a_module_may_import_the_engine_itself_and_what_it_declares():
    tasks = declared("tasks", "core.modules.tasks")
    plans = declared("plans", "core.modules.plans", ["tasks"])
    rules = LayerRules(LayerTable(), [tasks, plans])
    plan_layer = Layer(LayerTier.CORE_MODULE, "plans")
    assert rules.allowed(plan_layer) == {plan_layer, Layer(LayerTier.ENGINE, "engine"), Layer(LayerTier.CORE_MODULE, "tasks")}


def test_a_suite_is_limited_to_the_public_folders_of_a_core_module_in_the_printed_table():
    tasks = declared("tasks", "core.modules.tasks")
    coding = declared("coding", "suites.coding", ["tasks"])
    assert "suite coding may use: engine, core module tasks (public folders)" in LayerRules(LayerTable(), [tasks, coding]).table_lines()


def test_the_engine_may_import_only_itself():
    engine = Layer(LayerTier.ENGINE, "engine")
    assert LayerRules(LayerTable(), []).allowed(engine) == {engine}


def test_an_undeclared_import_fails(tmp_path):
    module_folder(tmp_path, "core.modules.tasks", "tasks")
    module_folder(tmp_path, "core.modules.plans", "plans", "from core.modules.tasks.models.task import Task\n")
    tasks, plans = declared("tasks", "core.modules.tasks"), declared("plans", "core.modules.plans")
    assert failures(tmp_path, tasks, plans) == ["src/core/modules/plans/plans_module.py imports core module tasks, which core module plans may not use"]


def test_a_relative_import_counts_as_the_module_it_names(tmp_path):
    module_folder(tmp_path, "core.modules.tasks", "tasks")
    module_folder(tmp_path, "core.modules.plans", "plans", "from ..tasks.models.task import Task\n")
    tasks, plans = declared("tasks", "core.modules.tasks"), declared("plans", "core.modules.plans")
    assert failures(tmp_path, tasks, plans) == ["src/core/modules/plans/plans_module.py imports core module tasks, which core module plans may not use"]


def test_a_loop_over_a_declaration_and_an_import_fails_with_both_names(tmp_path):
    module_folder(tmp_path, "core.modules.tasks", "tasks", "from core.modules.plans.models.plan import Plan\n")
    module_folder(tmp_path, "core.modules.plans", "plans")
    tasks, plans = declared("tasks", "core.modules.tasks"), declared("plans", "core.modules.plans", ["tasks"])
    lines = failures(tmp_path, tasks, plans)
    assert any("loop" in line and "core module tasks" in line and "core module plans" in line for line in lines), lines


def test_a_folder_with_no_declaration_fails(tmp_path):
    (tmp_path / "src" / "core" / "modules" / "orders").mkdir(parents=True)
    assert failures(tmp_path) == ["src/core/modules/orders: has no declaration class"]


def test_a_declaration_the_loader_does_not_list_fails(tmp_path):
    module_folder(tmp_path, "core.modules.orders", "orders")
    assert failures(tmp_path) == ["src/core/modules/orders: its declaration is not found by the loader"]


def test_a_dependency_that_is_not_installed_fails(tmp_path):
    module_folder(tmp_path, "core.modules.plans", "plans")
    assert failures(tmp_path, declared("plans", "core.modules.plans", ["tasks"])) == ["journal.plans depends on journal.tasks, which is not installed"]


def test_a_core_module_that_depends_on_a_suite_fails(tmp_path):
    module_folder(tmp_path, "core.modules.plans", "plans")
    module_folder(tmp_path, "suites.coding", "coding")
    plans, coding = declared("plans", "core.modules.plans", ["coding"]), declared("coding", "suites.coding")
    assert "journal.plans depends on journal.coding, which is above it" in failures(tmp_path, plans, coding)
