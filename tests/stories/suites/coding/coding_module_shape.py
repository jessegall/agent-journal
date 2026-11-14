import ast
from pathlib import Path

from engine.database.database import Database
from engine.registry.registry import Registry
from suites.coding.coding_module import CodingModule
from tests.stories.core.support.coding_fixtures import CodingEnvironment
from tests.stories.support.registry_compare import expect_registry_equal, saved_registry

SAMPLES = "tests.stories.suites.coding.support.shape_samples"
CODING_MODULE_FILE = Path(__file__).resolve().parents[4] / "src" / "suites" / "coding" / "coding_module.py"


def registry(story) -> Registry:
    return Registry.read(story.container.get(Database))


def test_583_a_reader_of_the_coding_module_sees_one_name_per_list_and_few_imports(new_story):
    story = new_story(fixture=CodingEnvironment)
    imports = [node for node in ast.parse(CODING_MODULE_FILE.read_text()).body if isinstance(node, ast.ImportFrom)]
    story.expect_rows(len(CODING_MODULE_FILE.read_text().splitlines()) < 60, len(imports) < 30, detail=f"{len(imports)} imports")


def test_584_the_registry_holds_every_window_skill_and_group_of_the_coding_module_and_a_sync_keeps_it_equal(new_story):
    story = new_story(fixture=CodingEnvironment)
    kept = registry(story)
    windows, skills, groups = {window.name for window in kept.windows}, {skill.folder for skill in kept.skills}, {group.key for group in kept.agent_groups}
    story.expect_rows({window.name for window in CodingModule.window_declarations()} <= windows, {skill.folder for skill in CodingModule.skill_declarations()} <= skills,
                      {group.key for group in CodingModule.group_declarations()} <= groups, detail=str(groups))
    saved = saved_registry(story)
    code, output_text = story.synced()
    story.expect_rows(code == 0, detail=output_text)
    expect_registry_equal(story, saved)


def test_585_a_new_suite_written_in_the_coding_modules_shape_loads_and_registers(new_story):
    story = new_story(fixture=CodingEnvironment)
    story.expect_sync_success(f"{SAMPLES}:ShopSuite")
    kept = registry(story)
    story.expect_rows("sample-shop.stock" in {window.name for window in kept.windows}, kept.suite("sample-shop").entrances["shop"] == ("sample-shop.stock", "messages.chat"))


def test_371_after_the_declarations_became_classes_a_sync_writes_the_same_registry(new_story):
    story = new_story(fixture=CodingEnvironment)
    saved = saved_registry(story)
    code, output_text = story.synced()
    story.expect_rows(code == 0, detail=output_text)
    expect_registry_equal(story, saved)
