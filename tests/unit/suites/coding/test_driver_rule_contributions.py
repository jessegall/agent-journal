from suites.coding.drivers.worker.worker_driver import WorkerDriver
from suites.coding.support.coding_contributions import CODING_NEEDS


def test_a_need_source_of_a_rule_the_worker_driver_lists_holds_only_workers():
    backed = [source for source in CODING_NEEDS if getattr(source, "rule", None) in WorkerDriver.rules]
    assert backed and all(source.agent_types == [WorkerDriver.role] for source in backed)
