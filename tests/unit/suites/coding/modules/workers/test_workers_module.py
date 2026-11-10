from suites.coding.coding_suite import CodingSuite
from suites.coding.coding_module import CodingModule
from suites.coding.modules.workers.workers_module import WorkersModule


def test_workers_module_order():
    assert WorkersModule.name == "journal.suites.coding.workers"
    assert CodingSuite.modules.index(WorkersModule) > CodingSuite.modules.index(CodingModule) == 0
