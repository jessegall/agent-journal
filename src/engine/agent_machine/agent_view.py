from collections.abc import Mapping
from dataclasses import dataclass, field
from datetime import datetime

from engine.enums.frame_end import FrameEnd
from engine.agent_stack.subject_reference import SubjectReference
from engine.agent_stack.answer_basis import AnswerBasis
from engine.agent_stack.escalation import Escalation
from engine.agent_stack.need_key import NeedKey
from engine.agent_stack.open_block import OpenBlock
from engine.agent_stack.stack import Stack
from engine.agent_machine.capabilities import Capabilities
from engine.agent_machine.stepping.grant import Grant
from engine.agent_machine.needs.rank_order import RankOrder
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.fact import Fact
from engine.agent_machine.needs.need import Need
from engine.agent_machine.record.refusal_counts import RefusalCounts
from engine.enums.condition_outcome import ConditionOutcome
from engine.enums.responder import Responder
from engine.enums.work_stop import WorkStop


@dataclass(frozen=True)
class AgentView:
    """Everything one step reads, in one snapshot that begins with the answer basis: the stack, the facts, the
    needs and hold plans, the open holds, the usable grants, the suppressions, the open escalation, the
    settings, whether the agent rests, its pin, its driver's contract and its program's capabilities, the
    refusal counts kept so far, how each open hold's condition was judged, and when the step runs."""

    basis: AnswerBasis
    agent: AgentReference
    program_name: str
    session: str
    profile: str
    driver_name: str
    session_generation: int
    stepped_at: datetime
    stack: Stack
    facts: tuple[Fact, ...]
    needs: tuple[Need, ...]
    plans: tuple[BlockPlan, ...]
    blocks: tuple[OpenBlock, ...]
    grants: tuple[Grant, ...]
    suppressions: tuple[NeedKey, ...]
    escalation: Escalation | None
    settings: Mapping[str, object]
    is_resting: bool
    table_digest: str
    work_stop: WorkStop
    responder: Responder
    rank_order: RankOrder
    depth_limit: int
    program: Capabilities
    counts: RefusalCounts
    block_outcomes: Mapping[int, ConditionOutcome]
    # when the agent's newest hook came, which a wake cause compares its own rows with
    newest_hook_at: datetime | None = None
    # when the journal last started, which the journal-started wake compares with the newest hook
    journal_started_at: datetime | None = None
    # the rules that refused the agent's last refused hook: a policy among them offers its skip at a tool use
    last_refused_rules: frozenset[str] = frozenset()
    # how the subjects of frames that left this step ended, as their need sources tell
    subject_ends: Mapping[SubjectReference, FrameEnd] = field(default_factory=dict)
