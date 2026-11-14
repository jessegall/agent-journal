from collections.abc import Sequence

from engine.driver.agent_hook import AgentHook
from engine.driver.agent_state import AgentState
from engine.driver.open_row import OpenRow
from engine.enums.state_tier import StateTier
from core.modules.processes.rules.run_queue_halted_rule import RunQueueHaltedRule
from core.modules.processes.support.run_queue_halt import RunQueueHalt

HALT_TABLE = "run-queue-halt"


class RunQueueHalted(AgentState):
    """A command halted the queue of runs, or an update waits for the running commands: the rule that reminds the
    main agent of it is asked in its own place only then. It reads no row: the halt file and the run lock open it."""

    name = "processes.queue-halted"
    tier = StateTier.IN_PLACE
    rules = [RunQueueHaltedRule]

    def __init__(self, halt: RunQueueHalt) -> None:
        self.halt = halt

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        if not self.halt.command_halted and not self.halt.is_update_waiting:
            return []
        return [OpenRow(HALT_TABLE, 0, hook.timestamp)]
