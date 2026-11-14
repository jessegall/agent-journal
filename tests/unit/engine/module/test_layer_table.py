import inspect
import json
from pathlib import Path

import pytest

from engine.module.layer import Layer
from engine.module.layer_check import LayerCheck
from engine.module.layer_rules import LayerRules
from engine.module.layer_table import LayerTable
from engine.enums.layer_tier import LayerTier
from engine.module.module import Module


CONFIG_FILE = Path(__file__).resolve().parents[4] / ".commandments" / "config.json"


def declared(name, folder, dependencies=()):
    class SampleModule(Module):
        pass

    SampleModule.name = f"journal.{name}"
    SampleModule.dependencies = [f"journal.{dependency}" for dependency in dependencies]
    SampleModule.__module__ = f"{folder}.{name}_module"
    return SampleModule


def module_folder(project, folder, name, source=""):
    target = project / "src" / folder.replace(".", "/")
    target.mkdir(parents=True, exist_ok=True)
    (target / f"{name}_module.py").write_text(source)


def failures(project, *modules):
    return LayerCheck(project, LayerTable(), modules).failures()


@pytest.mark.parametrize("path,layer", [
    ("src/engine/time/clock.py", Layer(LayerTier.ENGINE, "engine")),
    ("src/core/modules/tasks/models/task.py", Layer(LayerTier.CORE_MODULE, "tasks")),
    ("src/suites/coding/coding_module.py", Layer(LayerTier.SUITE, "coding")),
    ("src/suites/coding/modules/workers/workers_module.py", Layer(LayerTier.SUITE_MODULE, "coding/workers")),
    ("src/tunnels/tunler/tunler_module.py", Layer(LayerTier.TUNNEL, "tunler")),
    ("src/server/viewer/page.py", Layer(LayerTier.HOST, "server")),
    ("src/install/hook/hook_switch.py", Layer(LayerTier.HOST, "install")),
    ("src/engine/testing/stories/story.py", Layer(LayerTier.TEST_KIT, "test kit")),
    ("src/core/modules/skills/testing/story_skill_requirement.py", Layer(LayerTier.TEST_KIT, "skills")),
    ("src/suites/coding/modules/workers/testing/sample_worker.py", Layer(LayerTier.TEST_KIT, "coding/modules/workers")),
])
def test_a_path_gives_its_layer(path, layer):
    assert LayerTable().file_layer(path) == layer


def test_a_path_that_matches_no_pattern_has_no_layer():
    assert LayerTable().file_layer("src/core/loose_file.py") is None


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


def test_the_test_kit_may_import_every_layer(tmp_path):
    module_folder(tmp_path, "core.modules.tasks", "tasks")
    module_folder(tmp_path, "engine.testing.stories", "story", "from core.modules.tasks.models.task import Task\nfrom server.server import Server\n")
    module_folder(tmp_path, "core.modules.tasks.testing", "story_task", "from core.modules.tasks.models.task import Task\nfrom engine.testing.stories.story_module import Story\n")
    assert failures(tmp_path, declared("tasks", "core.modules.tasks")) == []


def test_no_layer_below_the_test_kit_may_import_it(tmp_path):
    module_folder(tmp_path, "core.modules.tasks", "tasks", "from engine.testing.stories.story import Story\nfrom core.modules.tasks.testing.story_task import StoryTask\n")
    module_folder(tmp_path, "engine.time", "clock", "from engine.testing.fakes.manual_clock import ManualClock\n")
    assert failures(tmp_path, declared("tasks", "core.modules.tasks")) == [
        "src/core/modules/tasks/tasks_module.py imports test kit, which core module tasks may not use",
        "src/core/modules/tasks/tasks_module.py imports test kit tasks, which core module tasks may not use",
        "src/engine/time/clock_module.py imports test kit, which engine may not use",
    ]


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




def undeclared_import(project):
    module_folder(project, "core.modules.tasks", "tasks")
    module_folder(project, "core.modules.plans", "plans", "from core.modules.tasks.models.task import Task\n")
    return declared("tasks", "core.modules.tasks"), declared("plans", "core.modules.plans")


def test_allow_list_is_gone():
    folder = Path(inspect.getfile(LayerCheck)).parent
    assert not list(folder.glob("layer_allow_list*")) and "allow_list" not in inspect.signature(LayerCheck).parameters


def test_a_file_that_lists_the_modules_of_a_top_folder_is_in_a_layer_and_may_import_them(tmp_path):
    module_folder(tmp_path, "core.modules.tasks", "tasks")
    (tmp_path / "src" / "core" / "modules" / "__init__.py").write_text("from core.modules.tasks.tasks_module import TasksModule\n")
    assert LayerTable().file_layer("src/core/modules/__init__.py").label == "module list core/modules"
    assert failures(tmp_path, declared("tasks", "core.modules.tasks")) == []


def test_a_suite_declaration_is_a_module_list_and_may_import_the_modules_it_lists(tmp_path):
    module_folder(tmp_path, "suites.coding", "coding")
    module_folder(tmp_path, "suites.coding.modules.workers", "workers", "from suites.coding.coding_module import CodingModule\n")
    (tmp_path / "src" / "suites" / "coding" / "coding_suite.py").write_text("from suites.coding.coding_module import CodingModule\nfrom suites.coding.modules.workers.workers_module import WorkersModule\n")
    coding, workers = declared("coding", "suites.coding"), declared("workers", "suites.coding.modules.workers", ["coding"])
    assert LayerTable().file_layer("src/suites/coding/coding_suite.py").label == "module list suites/coding"
    assert failures(tmp_path, coding, workers) == []


def test_no_hand_written_layer_is_left():
    assert "python/NamespaceDependencyDetector" not in json.loads(CONFIG_FILE.read_text())["configure"]
