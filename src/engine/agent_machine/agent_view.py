from collections.abc import Mapping
from dataclasses import dataclass

from engine.agent_stack.answer_basis import AnswerBasis
from engine.agent_stack.escalation import Escalation
from engine.agent_stack.need_key import NeedKey
from engine.agent_stack.open_hold import OpenHold
from engine.agent_stack.stack import Stack
from engine.agent_machine.capabilities import Capabilities
from engine.agent_machine.contracts.grant import Grant
from engine.agent_machine.contracts.rank_order import RankOrder
from engine.agent_machine.needs.hold_plan import HoldPlan
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.fact import Fact
from engine.agent_machine.needs.need import Need
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop


@dataclass(frozen=True)
class AgentView:
    """Everything one step reads, in one snapshot that begins with the answer basis: the stack, the facts, the
    needs and hold plans, the open holds, the usable grants, the suppressions, the open escalation, the settings,
    whether the agent rests, its pin, its driver's contract and its program's capabilities."""

    basis: AnswerBasis
    agent: AgentReference
    stack: Stack
    facts: tuple[Fact, ...]
    needs: tuple[Need, ...]
    plans: tuple[HoldPlan, ...]
    blocks: tuple[OpenHold, ...]
    grants: tuple[Grant, ...]
    suppressions: tuple[NeedKey, ...]
    escalation: Escalation | None
    settings: Mapping[str, object]
    is_resting: bool
    pinned_slices: tuple[str, ...]
    work_stop: WorkStop
    responder: Responder
    rank_order: RankOrder
    depth_limit: int
    program: Capabilities
