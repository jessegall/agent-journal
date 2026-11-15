from collections.abc import Mapping, Sequence

from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.needs.need_source import NeedSource
from engine.agent_machine.record.question import Question
from engine.driver.nudge import Nudge
from engine.agent_stack.states.blocked import Blocked
from core.modules.sequences.models.sequence_run import SequenceRun
from core.modules.sequences.nudges.step_waits_nudge import StepWaitsNudge
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.support.sequence_step_started import SequenceStepStarted

UNTAKEN_STEP_KEY = "sequences.untaken-step"


class UnstartedStepNeeds(NeedSource):
    """An agent whose sequence step is not taken up yet is blocked until it runs journal sequence follow."""

    replaced_rules = tuple([UNTAKEN_STEP_KEY])
    state_type = Blocked
    rank = UNTAKEN_STEP_KEY

    def __init__(self, runs: SequenceRunQuery) -> None:
        self.runs = runs

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        runs = {agent.agent_id: self.untaken(agent.agent_id) for agent in agents}
        return {agent_id: [self.plan(run)] for agent_id, run in runs.items() if run is not None}

    def untaken(self, agent_id: int) -> SequenceRun | None:
        run = self.runs.current(agent_id)
        return run if run is not None and not run.step_started else None

    @staticmethod
    def plan(run: SequenceRun) -> BlockPlan:
        return BlockPlan(UnstartedStepNeeds.nudge(run), SequenceStepStarted([run.id, run.step_number]), UNTAKEN_STEP_KEY, UNTAKEN_STEP_KEY, scope_tools=True, scope_stop=False)

    @staticmethod
    def nudge(run: SequenceRun) -> Nudge:
        return StepWaitsNudge.declared().nudge(sequence=run.sequence_id, step=run.step_number)
