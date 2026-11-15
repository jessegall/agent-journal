from core.modules.processes.lines.run_queue_halted_lines import RunQueueHaltedLines
from types import SimpleNamespace

from engine.driver.open_row import OpenRow
from engine.driver.rule_answer import RuleAnswer
from engine.enums.state_tier import StateTier
from engine.time.timestamp import Timestamp
from core.modules.processes.rules.run_queue_halted_rule import RunQueueHaltedRule
from core.modules.processes.states.run_queue_halted import RunQueueHalted

NOW = Timestamp.parsed("2026-11-14T07:00:00+00:00")
HOOK = SimpleNamespace(agent_id=7, timestamp=NOW, event=None)


def halt(command_halted: bool = False, update_waiting: bool = False) -> SimpleNamespace:
    return SimpleNamespace(command_halted=command_halted, is_update_waiting=update_waiting, running_run_ids=lambda: ())


def test_the_state_is_asked_in_place_and_gates_the_halted_queue_rule():
    assert (RunQueueHalted.name, RunQueueHalted.tier, RunQueueHalted.rules) == ("processes.queue-halted", StateTier.IN_PLACE, [RunQueueHaltedRule])


def test_with_the_queue_running_and_no_update_waiting_the_state_is_closed_and_the_rule_answers_allowed():
    running = halt()
    assert RunQueueHalted(running).open_rows(HOOK) == []
    assert RunQueueHaltedRule(RunQueueHaltedLines(running)).answer(HOOK) == RuleAnswer.allowed()


def test_a_halt_by_command_or_a_waiting_update_opens_the_state_for_the_hook():
    assert RunQueueHalted(halt(command_halted=True)).open_rows(HOOK) == [OpenRow("run-queue-halt", 0, NOW)]
    assert RunQueueHalted(halt(update_waiting=True)).open_rows(HOOK) == [OpenRow("run-queue-halt", 0, NOW)]
