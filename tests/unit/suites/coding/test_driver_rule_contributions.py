from suites.coding.drivers.worker.worker_driver import WorkerDriver
from suites.coding.support.coding_contributions import CODING_NEEDS


def test_a_need_source_of_a_rule_the_worker_driver_lists_holds_only_workers():
    listed = {rule.name for rule in WorkerDriver.rules}
    held = [source for source in CODING_NEEDS if set(source.replaced_rules) & listed]
    assert held and all(list(source.agent_types) == [WorkerDriver.role] for source in held)
