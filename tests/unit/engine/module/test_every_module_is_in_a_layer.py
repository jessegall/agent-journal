from pathlib import Path

from engine.journal.journal_home import JournalHome
from engine.module.layer_allow_list import LayerAllowList
from engine.module.layer_check import LayerCheck
from engine.module.layer_table import LayerTable
from engine.module.module_finder import ModuleFinder

PROJECT_FOLDER = Path(__file__).resolve().parents[4]


def test_every_module_and_suite_is_in_a_layer():
    modules = ModuleFinder(JournalHome(PROJECT_FOLDER / ".journal")).default_modules()
    assert LayerCheck(PROJECT_FOLDER, LayerTable(), modules, LayerAllowList.lines()).failures() == []
