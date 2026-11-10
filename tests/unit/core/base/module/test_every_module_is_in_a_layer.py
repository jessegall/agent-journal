from pathlib import Path

from engine.journal.journal_home import JournalHome
from core.base.module.layer_allow_list import LayerAllowList
from core.base.module.layer_check import LayerCheck
from core.base.module.layer_table import LayerTable
from core.base.module.module_finder import ModuleFinder

PROJECT_FOLDER = Path(__file__).resolve().parents[5]


def test_every_module_and_suite_is_in_a_layer():
    modules = ModuleFinder(JournalHome(PROJECT_FOLDER / ".journal")).default_modules()
    assert LayerCheck(PROJECT_FOLDER, LayerTable(), modules, LayerAllowList.lines()).failures() == []
