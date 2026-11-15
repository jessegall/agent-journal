from engine.agent_stack.answer_basis import AnswerBasis
from engine.agent_stack.escalation import Escalation
from engine.agent_stack.frame import Frame
from engine.agent_stack.need_key import NeedKey
from engine.agent_stack.open_block import OpenBlock
from engine.agent_stack.reason import Reason
from engine.agent_stack.stack import Stack
from engine.agent_stack.states.pause_cause import PauseCause
from engine.agent_stack.states.stopped import Stopped
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.capabilities import Capabilities
from engine.agent_machine.driver import Driver
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.ended_fact import EndedFact
from engine.agent_machine.needs.fact import Fact
from engine.agent_machine.needs.pause_fact import PauseFact
from engine.agent_machine.record.question import Question
from engine.agent_machine.record.refusal_counts import RefusalCounts
from engine.agent_machine.stepping.refusal_counting import STOP_LIMIT_SETTING, TOOL_LIMIT_SETTING
from engine.agent_step.agent_view_reader import AgentViewReader
from engine.agent_step.frame_codec import FrameCodec
from engine.enums.decision_class import DecisionClass
from engine.module.module_finder import ModuleFinder
from engine.query.queries import Queries
from engine.setting.setting_values import SettingValues
from engine.time.clock import Clock
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.agent_session import AgentSession
from core.modules.agents.models.enums.end_reason import EndReason
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.models.agent_escalation import AgentEscalation
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.models.driver_epoch import DriverEpoch
from core.modules.drivers.models.enums.escalation_state import EscalationState
from core.modules.drivers.models.program_epoch import ProgramEpoch
from core.modules.drivers.queries.hook_call_query import HookCallQuery

OPEN_BLOCKS_REASON = "the open blocks of one agent are few: each is closed or skipped before the agent goes on"
BOTTOM_KEY = NeedKey("Stopped", None, "bottom")
CORE_SUITE = "core"


class StoredAgentViewReader(AgentViewReader):
    """Reads an agent's view from its rows, the answer basis first: its stack row or a fresh bottom, its pause
    and its end, its open blocks and escalation, its refusal counts and the settings the machine reads,
    whether it rests, and its driver's contract. Needs, grants, suppressions, the outcomes of block
    conditions and the program's capabilities are read by the phases that port them; until then the view
    holds none."""

    def __init__(self, agents: AgentRows, queries: Queries, settings: SettingValues, hook_calls: HookCallQuery, finder: ModuleFinder, clock: Clock) -> None:
        self.agents, self.queries, self.settings, self.hook_calls, self.finder, self.clock = agents, queries, settings, hook_calls, finder, clock

    def read(self, agent_id: int, question: Question) -> AgentView:
        agent = self.agents.find(agent_id)
        row = self.queries.query(AgentStack).filter(session_agent_id=agent_id).first()
        driver = self.driver(agent.role)
        escalation = self.escalation(agent_id)
        counts = RefusalCounts(row.stop_refusals, row.tool_refusals, escalation) if row is not None else RefusalCounts(0, 0, escalation)
        return AgentView(
            basis=self.basis(row, agent), agent=AgentReference(agent.id, agent.parent_id, agent.environment_id, agent.role), program_name=agent.program,
            session=agent.session, profile=agent.profile, driver_name=driver.name, session_generation=1, stepped_at=self.clock.timestamp().value,
            stack=self.stack(row, agent), facts=self.facts(agent), needs=(), plans=(), blocks=self.blocks(agent_id), grants=(), suppressions=(),
            escalation=escalation, settings={key: self.settings.number(key) for key in (STOP_LIMIT_SETTING, TOOL_LIMIT_SETTING)},
            is_resting=self.hook_calls.has_ended_turn(agent_id), pinned_slices=row.pinned_slices if row is not None else (),
            table_digest=row.table_digest if row is not None else "", work_stop=driver.work_stop, responder=driver.responder, rank_order=driver.rank_order,
            depth_limit=driver.depth_limit, program=Capabilities(), counts=counts, block_outcomes={})

    def basis(self, row: AgentStack | None, agent: Agent) -> AnswerBasis:
        driver_epoch = self.queries.query(DriverEpoch).first()
        program_epoch = self.queries.query(ProgramEpoch).filter(program=agent.program).first()
        return AnswerBasis(row.version if row is not None else 0, driver_epoch.epoch if driver_epoch is not None else 0,
                           program_epoch.epoch if program_epoch is not None else 0)

    def stack(self, row: AgentStack | None, agent: Agent) -> Stack:
        # a row a permission change made before the agent's first step holds no frame yet, and reads as a fresh stack
        frames = FrameCodec.decoded(row.frames) if row is not None else []
        return Stack(frames or [Frame(Stopped(agent.creation_timestamp().value, "started", True), BOTTOM_KEY, agent.creation_timestamp().value)])

    def facts(self, agent: Agent) -> tuple[Fact, ...]:
        holder = self.agents.pause_holder(agent.id)
        pause = [PauseFact(None, tuple([PauseCause(holder.id, holder.id, holder.paused_at.value)]))] if holder.paused_at is not None else []
        return (*pause, *self.ended(agent))

    def ended(self, agent: Agent) -> list[Fact]:
        if agent.retired_at is not None:
            return [EndedFact(None, "retired", agent.retiring_actor_id or agent.id)]
        replaced = self.queries.query(AgentSession).filter(session_agent_id=agent.id, end_reason=EndReason.PERSON_REPLACEMENT.value).first()
        return [EndedFact(None, "replaced", agent.id)] if replaced is not None else []

    def blocks(self, agent_id: int) -> tuple[OpenBlock, ...]:
        rows = self.queries.query(AgentBlock).filter(session_agent_id=agent_id, closed_at=None).every_row(OPEN_BLOCKS_REASON)
        return tuple(self.open_block(row) for row in rows)

    def open_block(self, row: AgentBlock) -> OpenBlock:
        reason = Reason(row.nudge_key, DecisionClass.HOLD, row.nudge_key, row.nudge_text, row.lifting_lines)
        has_grace = bool(row.grace_tool_uses or row.grace_seconds)
        elapsed = row.creation_timestamp().elapsed_seconds(self.clock.timestamp())
        return OpenBlock(row.nudge_key, row.id, reason, row.has_tool_scope, row.has_stop_scope, not has_grace or elapsed >= row.grace_seconds > 0,
                         elapsed >= row.stop_grace_seconds, row.strict)

    def escalation(self, agent_id: int) -> Escalation | None:
        row = self.queries.query(AgentEscalation).filter(session_agent_id=agent_id, state=EscalationState.OPEN).first()
        if row is None:
            return None
        return Escalation(row.id, row.escalation_type, row.responder, row.block_ids, tuple(NeedKey("Working", None, key) for key in row.work_keys), row.refusal_count)

    def driver(self, agent_type: str) -> type[Driver]:
        drivers = [driver for module in self.finder.modules() for driver in module.agent_drivers if driver.agent_type == agent_type]
        return sorted(drivers, key=lambda driver: driver.suite == CORE_SUITE)[0]
