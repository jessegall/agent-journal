from collections.abc import Mapping, Sequence

from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.required_state import RequiredState
from engine.agent_machine.needs.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.states.blocked import Blocked
from engine.driver.agent_message import AgentMessage
from engine.time.clock import Clock
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.agent_messages.silent_run_blocked_message import SilentRunBlockedMessage
from core.modules.processes.support.block_conditions.run_heard_from import RunHeardFrom
from core.modules.processes.support.blocked_run import BlockedRun
from core.modules.processes.support.blocked_runs import BlockedRuns
from core.modules.processes.support.reading_notices.exit_texts import ExitTexts

SILENT_RUN_KEY = "processes.silent-run-hold"
SILENT_RUN_RANK = "processes.silent-run"


class SilentRunBlockNeeds(StateSource):
    """Holds the tool uses of an agent whose run has printed nothing for the hang time, naming the run and what its
    processor time does, until the agent reads its output, a user releases it or the run ends; the exits are said in the shared wording.
    Like every hold it lets reads and journal commands through."""
    state_type = Blocked
    rank = SILENT_RUN_RANK

    def __init__(self, blocked_runs: BlockedRuns, clock: Clock) -> None:
        self.blocked_runs, self.clock = blocked_runs, clock

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        held = {agent.agent_id: self.held(agent.agent_id) for agent in agents}
        return {agent_id: [BlockPlan(SilentRunBlockNeeds.agent_message(run), RunHeardFrom(run.process.id), SILENT_RUN_KEY, SILENT_RUN_RANK,
                                     scope_tools=True, scope_stop=False)]
                for agent_id, run in held.items() if run is not None}

    def held(self, agent_id: int) -> BlockedRun | None:
        return self.blocked_runs.found(agent_id, self.clock.timestamp())

    @staticmethod
    def agent_message(run: BlockedRun) -> AgentMessage:
        return SilentRunBlockedMessage.declared().agent_message(output=run.process.id, seconds=run.seconds, processor=run.processor, hint=ExitTexts.sentences(PressureLevel.FREEZE.exits))
