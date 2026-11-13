import json
from pathlib import Path

import pytest

from engine.journal.journal_home import JournalHome
from engine.module.layer_check import LayerCheck
from engine.module.layer_table import LayerTable
from engine.module.module_finder import ModuleFinder
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.engine.module.support.layer_project import LayerProject

ROOT = Path(__file__).resolve().parents[4]
CONFIG_FILE = ROOT / ".commandments" / "config.json"
MANUAL_LAYERS = "python/NamespaceDependencyDetector"


def layers_in_configuration(config_file: Path) -> list[object]:
    return json.loads(config_file.read_text())["configure"].get(MANUAL_LAYERS, [])


def test_523_a_layer_written_by_hand_in_the_configuration_is_found_and_the_real_one_holds_none(new_story, tmp_path):
    story = new_story(fixture=MainEnvironment)
    configuration = json.loads(CONFIG_FILE.read_text())
    configuration["configure"][MANUAL_LAYERS] = [{"layer": ["core.modules.orders"]}]
    copy = tmp_path / "config.json"
    copy.write_text(json.dumps(configuration))
    story.expect_rows(layers_in_configuration(copy) == [{"layer": ["core.modules.orders"]}], layers_in_configuration(CONFIG_FILE) == [], detail=str(layers_in_configuration(CONFIG_FILE)))


@pytest.mark.story_budget(cpu_seconds=8, reason="it reads the imports of every source file of the tree once")
def test_525_no_list_of_allowed_lines_is_left_and_the_tree_passes_the_layer_check_without_one(new_story):
    story = new_story()
    modules = ModuleFinder(JournalHome(ROOT / ".journal")).default_modules()
    failures = LayerCheck(ROOT, LayerTable(), modules).failures()
    leftover = sorted(path.name for path in (ROOT / "src" / "engine" / "module").glob("layer_allow_list*"))
    story.expect_rows(failures == [], leftover == [], LayerProject.layer_of("src/suites/__init__.py") == "module list suites", detail=f"{failures[:5]} {leftover}")
