from dataclasses import replace

from engine.agent_stack.answer_basis import AnswerBasis
from engine.agent_stack.states.state import State
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.capabilities import Capabilities
from engine.agent_machine.contracts.rank_order import RankOrder
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop
from engine.testing.agent_machine.stack_samples import StackSamples

SAMPLE_AGENT = AgentReference(4, None, 1, "main")
WORK_STOPS = {"main": WorkStop.REFUSE_WHILE_WORK_REMAINS, "worker": WorkStop.REFUSE_WHILE_WORK_REMAINS, "helper": WorkStop.HAND_IN,
              "merger": WorkStop.MERGE_CONTRACT}


class ViewSamples:
    """Agent views for tests of the machine: an agent of the given type over the given states, with no facts,
    needs, holds or grants, the settings given and a program that carries nothing; a test changes the rest with replace."""

    @staticmethod
    def of(agent_type: str, *states: State, **settings: object) -> AgentView:
        agent = replace(SAMPLE_AGENT, agent_type=agent_type, parent_id=None if agent_type == "main" else 1)
        responder = Responder.PERSON if agent_type == "main" else Responder.PARENT
        return AgentView(AnswerBasis(1, 1, 1), agent, StackSamples.built(*states), (), (), (), (), (), (), None, settings, False, (),
                         WORK_STOPS[agent_type], responder, RankOrder((), ()), 16, Capabilities())
