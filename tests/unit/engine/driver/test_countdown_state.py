from dataclasses import fields
from types import SimpleNamespace

from engine.driver.block_condition import BlockCondition
from engine.driver.count_down import CountDown
from engine.driver.interval import Interval
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.rule_answer import RuleAnswer
from engine.driver.states.countdown_state import CountdownState
from engine.enums.nudge_type import NudgeType


class TwentyTools:
    unit = "tool uses"
    count = 20


SPAN = TwentyTools()
REFUSAL = NudgeDeclaration("samples.held", NudgeType.REFUSAL, "{count} samples wait", turn_limited=False)
COUNTDOWN = CountDown("samples.countdown", "read sample {samples}", SPAN)
HOOK = SimpleNamespace(agent_id=7)


class SampleCountdown(CountdownState):
    span = SPAN
    refusal = REFUSAL
    countdown = COUNTDOWN


def same_block(first, second) -> bool:
    return all(getattr(first, field.name) == getattr(second, field.name) for field in fields(first) if field.name != "after") and first.after.spans == second.after.spans


def test_start_builds_the_block_that_blocking_after_builds_for_the_same_arguments():
    condition = BlockCondition(3)
    started = SampleCountdown.start(HOOK, condition, {"count": 2}, samples="3, 4")
    built = RuleAnswer.allowed().blocking_after(HOOK, REFUSAL.nudge(count=2), condition, Interval(SPAN), COUNTDOWN.nudge("{left}", samples="3, 4")).commands[0]
    assert same_block(started, built)
    assert started.strict is False


def test_the_state_is_keyed_by_the_refusal_it_starts():
    assert SampleCountdown(SimpleNamespace()).keys() == ["samples.held"]
