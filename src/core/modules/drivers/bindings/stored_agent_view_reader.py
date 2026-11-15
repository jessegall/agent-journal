from engine.helper_type.helper_type_book import HelperTypeBook
from core.modules.drivers.support.answer_basis_rows import AnswerBasisRows
from core.modules.drivers.support.open_block_rows import OpenBlockRows
from datetime import datetime
from core.modules.drivers.support.driver_settings import CAPABILITY_PROOFS_SETTING
from core.modules.drivers.support.block_judgement import BlockJudgement
from core.modules.drivers.models.hidden_state import OPEN_SUPPRESSIONS_REASON, HiddenState
from engine.driver.refusal_skips import RefusalSkips
from engine.enums.responder import Responder
from engine.agent_stack.read_versions import ReadVersions
from engine.agent_stack.escalation import Escalation
from engine.agent_stack.stacked_state import StackedState
from engine.agent_stack.state_key import StateKey
from engine.agent_stack.open_block import OpenBlock
from engine.agent_stack.reason import Reason
from engine.agent_stack.stack import Stack
from engine.agent_stack.states.pause_cause import PauseCause
from engine.agent_stack.states.stopped import Stopped
from engine.agent_machine.agent_view import AgentView
from engine.provider.providers import Providers
from engine.agent_machine.stepping.grant import Grant
from engine.agent_machine.stepping.grant_ledger import GrantLedger
from engine.agent_machine.driver import CORE_SUITE, Driver
from core.modules.drivers.support.suite_choice import SuiteChoice
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.ended_fact import EndedFact
from engine.agent_machine.needs.fact import Fact
from engine.agent_machine.needs.pause_fact import PauseFact
from engine.agent_machine.record.question import Question
from engine.agent_machine.record.refusal_counts import RefusalCounts
from engine.agent_machine.stepping.refusal_counting import STOP_LIMIT_SETTING, TOOL_LIMIT_SETTING
from engine.agent_step.agent_view_reader import AgentViewReader
from engine.agent_step.stack_codec import StackCodec
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
from core.modules.drivers.nudges.paused_refusal_message import PausedRefusalMessage
from core.modules.drivers.models.driver_version import DriverVersion
from core.modules.drivers.models.enums.escalation_state import EscalationState
from core.modules.drivers.queries.hook_call_query import HookCallQuery

BOTTOM_KEY = StateKey("Stopped", None, "bottom")


class StoredAgentViewReader(AgentViewReader):
    """Reads an agent's view from its rows, the answer basis first: its stack row or a fresh bottom, its pause
    and its end, its open blocks and escalation, its refusal counts and the settings the machine reads,
    whether it rests, and its driver's contract. Needs, grants, suppressions, the outcomes of block
    conditions and the program's capabilities are read by the phases that port them; until then the view
    holds none."""

    def __init__(self, agents: AgentRows, queries: Queries, settings: SettingValues, hook_calls: HookCallQuery, finder: ModuleFinder, clock: Clock, grant_store: GrantLedger, providers: Providers, judgement: BlockJudgement,
                 skips: RefusalSkips, open_blocks: OpenBlockRows, stacks: AnswerBasisRows, types: HelperTypeBook, choice: SuiteChoice) -> None:
        self.providers, self.skips, self.open_blocks, self.stacks, self.types = providers, skips, open_blocks, stacks, types
        self.agents, self.queries, self.settings, self.hook_calls, self.finder, self.clock = agents, queries, settings, hook_calls, finder, clock
        self.grant_store, self.judgement, self.choice = grant_store, judgement, choice

    def read(self, agent_id: int, question: Question) -> AgentView:
        agent = self.agents.find(agent_id)
        row = self.stacks.row(agent_id)
        driver = self.driver(agent.role)
        escalation = self.escalation(agent_id)
        counts = RefusalCounts(row.stop_refusals, row.tool_refusals, escalation) if row is not None else RefusalCounts(0, 0, escalation)
        reference = AgentReference(agent.id, agent.parent_id, agent.environment_id, agent.role)
        rows = self.open_rows(agent_id)
        driver_epoch = self.stacks.driver_epoch()
        return AgentView(
            basis=self.basis(row, agent, driver_epoch), agent=reference, program_name=agent.program,
            session=agent.session, profile=agent.profile, driver_name=driver.name, session_generation=1, stepped_at=self.clock.timestamp().value,
            stack=self.stack(row, agent), facts=self.facts(agent), needs=(), plans=(), blocks=self.blocks(rows, agent_id), grants=self.grants(reference), suppressions=self.suppressions(agent_id),
            escalation=escalation, settings={key: self.settings.number(key) for key in (STOP_LIMIT_SETTING, TOOL_LIMIT_SETTING)},
            is_resting=self.hook_calls.has_ended_turn(agent_id),
            table_digest=row.table_digest if row is not None else "", work_stop=driver.work_stop, responder=self.responder(driver.responder, agent), rank_order=driver.rank_order,
            depth_limit=driver.depth_limit, program=self.providers.provider(agent.program).capabilities().proved(agent.program, self.settings.texts(CAPABILITY_PROOFS_SETTING)), counts=counts, block_outcomes=self.judgement.outcomes(rows, question, agent_id), newest_hook_at=self.newest_hook_at(agent_id), last_refused_rules=self.skips.last_refused_rules(agent_id),
            journal_started_at=driver_epoch.started_at.value if driver_epoch is not None and driver_epoch.started_at is not None else None)

    def suppressions(self, agent_id: int) -> tuple[StateKey, ...]:
        rows = self.queries.query(HiddenState).filter(session_agent_id=agent_id, ended_at=None).every_row(OPEN_SUPPRESSIONS_REASON)
        return tuple(StackCodec.decoded_key(row.need_key) for row in rows)

    def newest_hook_at(self, agent_id: int) -> datetime | None:
        hook = self.hook_calls.newest_agent_hook(agent_id)
        return hook.creation_timestamp().value if hook is not None else None

    # a parent that is gone or retired cannot answer, so the person does (doc 1310 section 4.6)
    def responder(self, responder: Responder, agent: Agent) -> Responder:
        if responder is not Responder.PARENT:
            return responder
        parent = self.agents.find_unscoped(agent.parent_id) if agent.parent_id is not None else None
        return Responder.PERSON if parent is None or parent.retired_at is not None else Responder.PARENT

    def grants(self, agent: AgentReference) -> tuple[Grant, ...]:
        return tuple(self.grant_store.usable_grants([agent]).get(agent.agent_id, ()))

    def basis(self, row: AgentStack | None, agent: Agent, driver_epoch: DriverVersion | None) -> ReadVersions:
        program_epoch = self.stacks.program_epoch(agent.program)
        return ReadVersions(row.version if row is not None else 0, driver_epoch.epoch if driver_epoch is not None else 0,
                           program_epoch.epoch if program_epoch is not None else 0)

    def stack(self, row: AgentStack | None, agent: Agent) -> Stack:
        # a row a permission change made before the agent's first step holds no frame yet, and reads as a fresh stack
        frames = StackCodec.decoded(row.frames) if row is not None else []
        return Stack(frames or [StackedState(Stopped(agent.creation_timestamp().value, "started", True), BOTTOM_KEY, agent.creation_timestamp().value)])

    def facts(self, agent: Agent) -> tuple[Fact, ...]:
        causes = tuple(PauseCause(paused.id, paused.id, paused.paused_at.value) for paused in self.agents.paused_line(agent.id) if paused.paused_at is not None)
        pause = [PauseFact(None, causes, PausedRefusalMessage.declared().nudge().text)] if causes else []
        return (*pause, *self.ended(agent))

    def ended(self, agent: Agent) -> list[Fact]:
        if agent.retired_at is not None:
            return [EndedFact(None, "retired", agent.retiring_actor_id or agent.id)]
        replaced = self.queries.query(AgentSession).filter(session_agent_id=agent.id, end_reason=EndReason.PERSON_REPLACEMENT.value).first()
        return [EndedFact(None, "replaced", agent.id)] if replaced is not None else []

    # a row's tool grace passes after its committed tool uses or its seconds, whichever comes first, as the old block rule counts them
    def open_rows(self, agent_id: int) -> list[AgentBlock]:
        return list(self.open_blocks.rows(agent_id))

    def blocks(self, rows: list[AgentBlock], agent_id: int) -> tuple[OpenBlock, ...]:
        uses = self.open_blocks.grace_uses(agent_id)
        return tuple(self.open_block(row, uses.get(row.id, 0)) for row in rows)

    def open_block(self, row: AgentBlock, tool_uses: int) -> OpenBlock:
        reason = Reason(row.nudge_key, DecisionClass.HOLD, row.nudge_key, row.refusal_text, row.lifting_lines)
        timestamp = self.clock.timestamp()
        return OpenBlock(row.nudge_key, row.id, reason, row.has_tool_scope, row.has_stop_scope, row.is_active(tool_uses, timestamp),
                         row.creation_timestamp().elapsed_seconds(timestamp) >= row.stop_grace_seconds, row.strict)

    def escalation(self, agent_id: int) -> Escalation | None:
        row = self.queries.query(AgentEscalation).filter(session_agent_id=agent_id, state=EscalationState.OPEN).first()
        if row is None:
            return None
        return Escalation(row.id, row.escalation_type, row.responder, row.block_ids, tuple(StateKey("Working", None, key) for key in row.work_keys), row.refusal_count)

    # the environment's suite names the driver, a helper type with no driver of its own taking the one of the type it is
    # built on; with no suite chosen, the core driver of that type drives
    def driver(self, agent_type: str) -> type[Driver]:
        drivers = [driver for module in self.finder.modules() for driver in module.agent_drivers]
        chosen = self.choice.driver(agent_type)
        named = [driver for driver in drivers if chosen is not None and driver.name == chosen.name]
        if named:
            return named[0]
        for type_key in self.types.type_keys(agent_type):
            core = [driver for driver in drivers if driver.agent_type == type_key and driver.suite == CORE_SUITE]
            if core:
                return core[0]
        raise LookupError(f"no driver drives {agent_type} or a type it is built on")
