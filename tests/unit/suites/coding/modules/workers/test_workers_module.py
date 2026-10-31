from suites import DEFAULT_SUITES
from suites.coding.module import CodingModule
from suites.coding.modules.workers.module import WorkersModule


def test_workers_module_order():
    assert WorkersModule.name == "journal.suites.coding.workers"
    assert DEFAULT_SUITES.index(WorkersModule) > DEFAULT_SUITES.index(CodingModule)
