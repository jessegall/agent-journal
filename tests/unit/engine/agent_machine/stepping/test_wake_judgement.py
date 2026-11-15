from dataclasses import replace

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.needs.wake_cause import WakeCause
from engine.agent_machine.stepping.wake_judgement import WakeJudgement
from engine.enums.wake_move import WakeMove
from engine.enums.work_stop import WorkStop
from engine.testing.agent_machine.view_samples import ViewSamples


class ServerStoppedTurn(WakeCause):
    key = "samples.server-stopped"
    wakes_mid_turn = True

    def needs_wake(self, view: AgentView) -> bool:
        return True

    def text(self, view: AgentView) -> str:
        return "go on"


class ArrivedDump(ServerStoppedTurn):
    key = "samples.dump"
    wakes_mid_turn = False


def test_a_cause_that_wakes_in_a_turn_wakes_a_busy_agent_and_a_resting_cause_does_not():
    busy = replace(ViewSamples.view("main", WorkStop.REFUSE_WHILE_WORK_REMAINS), is_resting=False)
    change = WakeJudgement([ServerStoppedTurn(), ArrivedDump()]).change(busy, busy.stack)
    assert change.wake_move is WakeMove.WRITTEN and change.causes == tuple(["samples.server-stopped"])
