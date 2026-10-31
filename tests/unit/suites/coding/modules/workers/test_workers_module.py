from suites import DEFAULT_SUITES
from suites.coding.coding_module import CodingModule
from suites.coding.modules.workers.workers_module import WorkersModule


def test_workers_module_order():
    assert WorkersModule.name == "journal.suites.coding.workers"
    assert DEFAULT_SUITES.index(WorkersModule) > DEFAULT_SUITES.index(CodingModule)
