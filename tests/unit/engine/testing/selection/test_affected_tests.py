from pathlib import Path

from engine.testing.selection.affected_tests import FULL_TEST_FOLDER, STORY_FOLDERS, AffectedTests
from engine.testing.selection.function_bodies import FunctionBodies
from engine.testing.selection.test_map import TestMap

CART = "src/core/modules/shop/cart.py"
SOURCE = "LIMIT = 3\n\n\ndef total():\n    return 1\n\n\ndef count():\n    return 2\n"
TOTAL_TEST = "tests/unit/test_cart.py::test_total"
COUNT_TEST = "tests/unit/test_cart.py::test_count"
SHOP_STORY = "tests/stories/core/modules/shop/buying.py::test_buying"


def project(tmp_path: Path, source: str = SOURCE) -> Path:
    (tmp_path / CART).parent.mkdir(parents=True, exist_ok=True)
    (tmp_path / CART).write_text(source)
    return tmp_path


def selector(tmp_path: Path, source: str) -> AffectedTests:
    test_map = TestMap({TOTAL_TEST: [f"{CART}::total"], COUNT_TEST: [f"{CART}::count"], SHOP_STORY: ["src/core/modules/shop/checkout.py::pay"]},
                       {SHOP_STORY: ["src/core/modules/shop/fixtures.py"]}, {CART: FunctionBodies.hashes(SOURCE)})
    return AffectedTests(test_map, project(tmp_path, source))


def test_changed_body_selects_its_tests(tmp_path):
    assert selector(tmp_path, SOURCE.replace("return 1", "return 7")).arguments([CART]) == [TOTAL_TEST]


def test_change_outside_any_body_selects_the_tests_of_that_file_only(tmp_path):
    assert selector(tmp_path, SOURCE.replace("LIMIT = 3", "LIMIT = 4")).arguments([CART]) == [COUNT_TEST, TOTAL_TEST]


def test_changed_test_file_selects_itself(tmp_path):
    assert selector(tmp_path, SOURCE).arguments(["tests/unit/test_cart.py"]) == ["tests/unit/test_cart.py"]


def test_new_file_selects_the_tests_of_its_module(tmp_path):
    assert selector(tmp_path, SOURCE).arguments(["src/core/modules/shop/listeners/paid_listener.py"]) == [SHOP_STORY, COUNT_TEST, TOTAL_TEST]


def test_file_a_template_build_ran_selects_the_tests_of_that_template(tmp_path):
    assert SHOP_STORY in selector(tmp_path, SOURCE).arguments(["src/core/modules/shop/fixtures.py"])


def test_migration_change_selects_every_story(tmp_path):
    assert selector(tmp_path, SOURCE).arguments(["src/core/modules/shop/migrations/m001_carts.py"]) == list(STORY_FOLDERS)


def test_data_file_selects_the_tests_of_its_module(tmp_path):
    assert selector(tmp_path, SOURCE).arguments(["src/core/modules/shop/skills/buying/SKILL.md"]) == [SHOP_STORY, COUNT_TEST, TOTAL_TEST]


def test_engine_change_selects_everything(tmp_path):
    assert selector(tmp_path, SOURCE).arguments(["src/engine/database/database.py"]) == [FULL_TEST_FOLDER]


def test_missing_map_selects_everything(tmp_path):
    assert AffectedTests(TestMap(), project(tmp_path)).arguments([CART]) == [FULL_TEST_FOLDER]
