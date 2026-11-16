from collections.abc import Mapping, Sequence

from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.states.block_plan import BlockPlan
from engine.agent_machine.states.required_state import RequiredState
from engine.agent_machine.states.state_source import StateSource
from engine.agent_machine.record.question import Question
from engine.driver.agent_message import AgentMessage
from engine.agent_stack.states.blocked import Blocked
from core.modules.sequences.models.sequence_run import SequenceRun
from core.modules.sequences.agent_messages.step_waits_message import StepWaitsMessage
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.sequences.support.sequence_step_started import SequenceStepStarted

UNSTARTED_STEP_KEY = "sequences.untaken-step"


class UnstartedStepStates(StateSource):
    """An agent whose sequence step is not taken up yet is blocked until it runs journal sequence follow."""
    state_type = Blocked
    rank = UNSTARTED_STEP_KEY

    def __init__(self, runs: SequenceRunQuery) -> None:
        self.runs = runs

    def states(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[RequiredState | BlockPlan]]:
        runs = {agent.agent_id: self.unstarted_run(agent.agent_id) for agent in agents}
        return {agent_id: [self.plan(run)] for agent_id, run in runs.items() if run is not None}

    def unstarted_run(self, agent_id: int) -> SequenceRun | None:
        run = self.runs.current(agent_id)
        return run if run is not None and not run.step_started else None

    @staticmethod
    def plan(run: SequenceRun) -> BlockPlan:
        return BlockPlan(UnstartedStepStates.agent_message(run), SequenceStepStarted([run.id, run.step_number]), UNSTARTED_STEP_KEY, UNSTARTED_STEP_KEY, scope_tools=True, scope_stop=False)

    @staticmethod
    def agent_message(run: SequenceRun) -> AgentMessage:
        return StepWaitsMessage.declared().agent_message(sequence=run.sequence_id, step=run.step_number)
