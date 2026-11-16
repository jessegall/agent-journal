from types import SimpleNamespace

from engine.driver.conditions.unregistered_condition import UnregisteredCondition
from engine.enums.condition_outcome import ConditionOutcome
from core.modules.drivers.support.block_condition_check import BlockConditionCheck


class SampleCondition:
    def __init__(self, has_target: bool, is_true: bool, fails: bool = False) -> None:
        self.target, self.true, self.fails = has_target, is_true, fails

    def has_target(self, container) -> bool:
        if self.fails:
            raise RuntimeError("the condition's rows are gone")
        return self.target

    def is_true(self, check) -> bool:
        return self.true


def outcome(condition) -> ConditionOutcome:
    condition_check = BlockConditionCheck(SimpleNamespace(built=lambda name, text: condition), None, None, None, SimpleNamespace(reported=lambda *values: None))
    row = SimpleNamespace(condition_name="sample", condition_text="", creation_timestamp=lambda: None)
    return condition_check.outcome(row, SimpleNamespace(environment_id=1))


def test_each_outcome_is_typed():
    assert [outcome(condition) for condition in (SampleCondition(False, False), SampleCondition(True, True), SampleCondition(True, False))] == [
        ConditionOutcome.TARGET_MISSING, ConditionOutcome.SATISFIED, ConditionOutcome.PENDING]


def test_a_condition_that_cannot_be_judged_is_unavailable_never_satisfied():
    assert [outcome(condition) for condition in (SampleCondition(True, True, fails=True), UnregisteredCondition())] == [ConditionOutcome.UNAVAILABLE, ConditionOutcome.UNAVAILABLE]
