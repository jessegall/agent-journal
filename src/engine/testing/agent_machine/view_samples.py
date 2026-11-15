from dataclasses import replace

from engine.agent_stack.read_versions import ReadVersions
from engine.agent_stack.states.state import State
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.capabilities import Capabilities
from engine.agent_machine.states.rank_order import RankOrder
from engine.agent_machine.states.agent_reference import AgentReference
from engine.agent_machine.record.refusal_counts import RefusalCounts
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop
from engine.testing.agent_machine.stack_samples import SAMPLE_TIME, StackSamples

SAMPLE_AGENT = AgentReference(4, None, 1, "main")


class ViewSamples:
    """Agent views for tests of the machine: an agent of the given type and work-stop contract over the given
    states, with no facts, needs, blocks or grants, the settings given and a program that supports nothing; a
    person answers an agent with no parent. A test changes the rest with replace."""

    @staticmethod
    def view(agent_type: str, work_stop: WorkStop, *states: State, has_parent: bool = True, **settings: object) -> AgentView:
        agent = replace(SAMPLE_AGENT, agent_type=agent_type, parent_id=1 if has_parent else None)
        responder = Responder.PARENT if has_parent else Responder.PERSON
        return AgentView(ReadVersions(1, 1, 1), agent, "claude", "s-1", f"{agent_type} profile", f"samples.{agent_type}", 1, SAMPLE_TIME, StackSamples.built(*states), (), (), (), (), (), (), None, settings, False,
                         "sample-digest", work_stop, responder, RankOrder((), ()), 16, Capabilities(), RefusalCounts(0, 0), {})
