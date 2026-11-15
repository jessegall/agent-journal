from collections.abc import Mapping, Sequence

from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.needs.need_source import NeedSource
from engine.agent_machine.record.question import Question
from engine.agent_stack.states.blocked import Blocked
from engine.driver.nudge import Nudge
from engine.time.clock import Clock
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.nudges.silent_run_blocked_nudge import SilentRunBlockedNudge
from core.modules.processes.support.block_conditions.run_heard_from import RunHeardFrom
from core.modules.processes.support.blocked_run import BlockedRun
from core.modules.processes.support.blocked_runs import BlockedRuns
from core.modules.processes.support.reading_notices.exit_texts import ExitTexts

SILENT_RUN_KEY = "processes.silent-run-hold"
SILENT_RUN_RANK = "processes.silent-run"


class SilentRunBlockNeeds(NeedSource):
    """Holds the tool uses of an agent whose run has printed nothing for the hang time, naming the run and what its
    processor time does, until the agent reads its output, a user releases it or the run ends; the exits are said in the shared wording.
    Like every hold it lets reads and journal commands through."""

    replaced_rules = tuple([SILENT_RUN_KEY])
    state_type = Blocked
    rank = SILENT_RUN_RANK

    def __init__(self, blocked_runs: BlockedRuns, clock: Clock) -> None:
        self.blocked_runs, self.clock = blocked_runs, clock

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        held = {agent.agent_id: self.held(agent.agent_id) for agent in agents}
        return {agent_id: [BlockPlan(SilentRunBlockNeeds.nudge(run), RunHeardFrom(run.process.id), SILENT_RUN_KEY, SILENT_RUN_RANK,
                                     scope_tools=True, scope_stop=False)]
                for agent_id, run in held.items() if run is not None}

    def held(self, agent_id: int) -> BlockedRun | None:
        return self.blocked_runs.found(agent_id, self.clock.timestamp())

    @staticmethod
    def nudge(run: BlockedRun) -> Nudge:
        return SilentRunBlockedNudge.declared().nudge(output=run.process.id, seconds=run.seconds, processor=run.processor, hint=ExitTexts.sentences(PressureLevel.FREEZE.exits))
