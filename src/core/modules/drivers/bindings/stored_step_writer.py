from core.modules.drivers.support.effect_commands import EffectCommands
from core.modules.drivers.support.message_log import MessageLog
from core.modules.drivers.support.required_commands import RequiredCommands
from core.modules.drivers.support.line_history_writer import LineHistoryWriter
from core.modules.drivers.support.read_versions_rows import ReadVersionsRows
from engine.enums.closer_role import CloserRole
import json
from collections.abc import Mapping, Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.stepping.grant_ledger import GrantLedger
from engine.driver.message_sender import MessageSender
from engine.agent_machine.decision_record import DecisionRecord
from engine.agent_machine.states.block_plan import BlockPlan
from engine.agent_machine.record.block_closing import BlockClosing
from engine.agent_machine.record.wake_change import WakeChange
from engine.agent_machine.step_result import StepResult
from engine.agent_step.errors.required_effect_error import RequiredEffectError
from engine.agent_step.stack_codec import StackCodec
from engine.agent_step.step_commit import StepCommit
from engine.agent_step.step_writer import StepWriter
from engine.command.bus import Bus
from engine.command.context import Context
from engine.database.database import Database
from engine.enums.wake_move import WakeMove
from engine.errors.refusal import Refusal
from engine.query.conditions.among import Among
from engine.query.conditions.excluding import Excluding
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.models.agent_escalation import AgentEscalation
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.models.agent_stack_move import AgentStackMove
from core.modules.drivers.models.agent_wake import AgentWake
from core.modules.drivers.models.enums.wake_state import WakeState

MACHINE_OPENER = "drivers.machine"
ENDED_WAKE_STATES = (WakeState.ACKNOWLEDGED, WakeState.CANCELLED, WakeState.EXPIRED)
STEP_CAUSE = "step"
CLOSED_BLOCKS_REASON = "a step closes the few blocks it judged ended"


class StoredStepWriter(StepWriter):
    """Saves a step in the write it is given, in the order of doc 1310 section 6.1: the answer basis is
    compared first and a change writes nothing; then the stack row and its moves, the blocks opened from
    plans and closed, the escalation, the unconditional effects each in its own savepoint, the admission
    effects when the step admits (a required one that fails raises and rolls everything back), and the
    wake. A step outside a hook that changed nothing runs only its unconditional effects."""

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, database: Database, grant_store: GrantLedger, message_sender: MessageSender, stacks: ReadVersionsRows,
                 effect_commands: EffectCommands, agent_message_log: MessageLog, history: LineHistoryWriter, required_commands: RequiredCommands) -> None:
        self.message_sender, self.stacks, self.effect_commands, self.agent_message_log, self.history = message_sender, stacks, effect_commands, agent_message_log, history
        self.required_commands = required_commands
        self.grant_store = grant_store
        self.queries, self.repository, self.bus, self.database = queries, repository, bus, database

    def save(self, view: AgentView, step: StepResult, hook_call_id: int | None, context: Context) -> StepCommit:
        # the row the view read, read again only when a write came between, which a changed basis then refuses
        row = self.stacks.row(view.agent.agent_id)
        if not self.read_versions_matches(row, view):
            return StepCommit.conflict()
        record = step.record
        if hook_call_id is None and not self.has_changes(row, view, step):
            failures, _ = self.run_effects(record.unconditional_effects, view, record, False, context)
            return StepCommit.saved(None, tuple(failures))
        row = self.saved_stack(row, view, step, context)
        for move in record.moves:
            self.repository.save(AgentStackMove(session_agent_id=view.agent.agent_id, move_type=move.move_type, stacked_state_key=f"{move.stacked_state_key.state_name}:{move.stacked_state_key.generation}" if move.stacked_state_key is not None else "",
                                                reason_text=move.reason_text, version_before=view.read_versions.stack_version, version_after=row.version,
                                                step_cause=STEP_CAUSE, hook_call_id=hook_call_id, stacked_state_end=move.stacked_state_end, actor_id=move.actor_id), context)
        self.open_blocks(record.blocks_opened, view, record, context)
        self.close_blocks(record.blocks_closed, context)
        self.save_escalation(view, record, context)
        failures, _ = self.run_effects(record.unconditional_effects, view, record, False, context)
        updated_input = None
        if record.decision.admits():
            self.spend_grants(record, context)
            admitted, updated_input = self.run_effects(record.allowed_effects, view, record, True, context)
            failures += admitted
        self.queue_waiting_lines(view, record, context)
        self.save_wake(view, record.wake, context)
        return StepCommit.saved(hook_call_id, tuple(failures), updated_input)

    # a line the program cannot carry at this event waits in today's line queue for the agent's next event that can
    def queue_waiting_lines(self, view: AgentView, record: DecisionRecord, context: Context) -> None:
        agent_id = view.agent.agent_id
        said = [(line, line.said()) for line in record.waiting_lines]
        held = self.agent_message_log.delayed(agent_id, [agent_message for _, agent_message in said], context.timestamp)
        queued = [(line, agent_message) for line, agent_message in said if (agent_message.key, agent_message.text) not in held]
        for line, agent_message in queued:
            self.message_sender.send_agent_message(agent_id, agent_message, line.source_key or line.key, context)
        self.agent_message_log.store_given(agent_id, [agent_message for _, agent_message in queued], context)
        self.required_commands.open(agent_id, [agent_message for _, agent_message in queued], context)
        self.history.record_given(agent_id, [line.source_key for line, _ in queued if line.source_key], context)

    # the grants that passed a refusing policy are spent in this write, and a journal command leaves its receipt
    def spend_grants(self, record: DecisionRecord, context: Context) -> None:
        event, tool = record.action.event, record.action.tool()
        fingerprint = record.action.fingerprint() if tool is not None and tool.journal_commands else ""
        for grant in record.spent_grants:
            self.grant_store.spend(grant, event.event_id if event is not None else "", fingerprint, context)

    def read_versions_matches(self, row: AgentStack | None, view: AgentView) -> bool:
        driver_version = self.stacks.driver_version()
        program_version = self.stacks.program_version(view.program_name)
        current = (row.version if row is not None else 0, driver_version.epoch if driver_version is not None else 0,
                   program_version.epoch if program_version is not None else 0)
        return current == (view.read_versions.stack_version, view.read_versions.driver_version, view.read_versions.program_version)

    @staticmethod
    def has_changes(row: AgentStack | None, view: AgentView, step: StepResult) -> bool:
        record = step.record
        changed_counts = (record.counts.stop_refusals, record.counts.tool_refusals) != (view.counts.stop_refusals, view.counts.tool_refusals)
        is_first_step = row is None or not row.has_stacked_states
        return bool(is_first_step or record.moves or record.blocks_opened or record.blocks_closed or record.waiting_lines or changed_counts or record.counts.escalation != view.escalation
                    or record.wake.wake_move is not WakeMove.UNCHANGED or step.stack != view.stack)

    def saved_stack(self, row: AgentStack | None, view: AgentView, step: StepResult, context: Context) -> AgentStack:
        values = {"driver_name": view.driver_name, "table_digest": view.table_digest,
                  "stacked_states": StackCodec.encoded(step.stack.stacked_states), "stop_refusals": step.record.counts.stop_refusals,
                  "tool_refusals": step.record.counts.tool_refusals}
        stack = row.changed(**values) if row is not None else AgentStack(session_agent_id=view.agent.agent_id, **values)
        return self.repository.save(stack, context)

    def open_blocks(self, plans: Sequence[BlockPlan], view: AgentView, record: DecisionRecord, context: Context) -> None:
        for plan in plans:
            self.repository.save(AgentBlock(session_agent_id=view.agent.agent_id, creator_id=view.agent.agent_id, agent_message_key=plan.agent_message.key,
                                            agent_message_text=plan.agent_message.text, condition_name=type(plan.condition).name, condition_text=plan.condition.text,
                                            grace_tool_uses=plan.tool_grace_uses, blocks_stop=plan.scope_stop and not plan.scope_tools, strict=plan.is_strict,
                                            scope_tools=plan.scope_tools, scope_stop=plan.scope_stop, stop_grace_seconds=plan.stop_grace_seconds,
                                            subject_model=plan.subject.model if plan.subject is not None else "",
                                            subject_id=plan.subject.row_id if plan.subject is not None else None, members=plan.members,
                                            context_generation=plan.context_generation, lifting_lines=plan.lifting_lines,
                                            closer_roles=tuple(role.value for role in plan.closer_roles), opener=MACHINE_OPENER,
                                            is_skippable=CloserRole.AGENT in plan.closer_roles, opening_event_id=record.identity.event_id,
                                            countdown_key=plan.countdown.key if plan.countdown is not None else "", countdown_text=plan.countdown.text if plan.countdown is not None else ""), context)

    def close_blocks(self, closings: Sequence[BlockClosing], context: Context) -> None:
        rows = {row.id: row for row in self.queries.query(AgentBlock).matching(Among("id", [closing.block_id for closing in closings])).every_row(CLOSED_BLOCKS_REASON)}
        for closing in closings:
            row = rows[closing.block_id]
            self.repository.save_change(row, row.changed(closed_at=context.timestamp, closed_reason=closing.block_end.value, closer=closing.closer,
                                                         closing_evidence=closing.closing_evidence), context)

    def save_escalation(self, view: AgentView, record: DecisionRecord, context: Context) -> None:
        escalation = record.counts.escalation
        if escalation is None or escalation == view.escalation:
            return
        if escalation.escalation_id:
            row = self.queries.query(AgentEscalation).find(escalation.escalation_id)
            self.repository.save(row.changed(block_ids=escalation.block_ids, work_keys=tuple(key.generation for key in escalation.work_keys),
                                             refusal_count=escalation.refusal_count), context)
            self.mark_escalated_blocks(row.id, escalation.block_ids, context)
            return
        row = self.repository.save(AgentEscalation(session_agent_id=view.agent.agent_id, escalation_type=escalation.escalation_type,
                                                   responder=escalation.responder, refusal_count=escalation.refusal_count, block_ids=escalation.block_ids,
                                                   work_keys=tuple(key.generation for key in escalation.work_keys)), context)
        self.mark_escalated_blocks(row.id, escalation.block_ids, context)

    # the holds an escalation defers name it, so a card and a person's answer find them (doc 1310 section 4.6)
    def mark_escalated_blocks(self, escalation_id: int, block_ids: tuple[int, ...], context: Context) -> None:
        for block in self.queries.query(AgentBlock).find_many(list(block_ids)):
            if block.escalation_id != escalation_id:
                self.repository.save(block.changed(escalation_id=escalation_id), context)

    # the lines of the effects that failed, and the tool input the first effect that gives one runs the action with
    def run_effects(self, effects: Sequence[Effect], view: AgentView, record: DecisionRecord, is_allowed_effect: bool, context: Context) -> tuple[list[str], Mapping[str, object] | None]:
        failures: list[str] = []
        updated_input: Mapping[str, object] | None = None
        for effect in effects:
            results: list[object] = []
            for command in self.effect_commands.of(effect, view, record):
                try:
                    with self.database.savepoint(type(command).__name__):
                        results.append(self.bus.dispatch(command, context.nested(command)))
                except Refusal as refusal:
                    if is_allowed_effect and effect.is_required:
                        raise RequiredEffectError(f"{type(effect).__name__} failed: {refusal}") from refusal
                    failures.append(f"the journal could not run {type(command).__name__}: {refusal}")
            updated_input = updated_input or effect.input_after(view, record, results)
        return failures, updated_input

    def save_wake(self, view: AgentView, wake: WakeChange, context: Context) -> None:
        if wake.wake_move is WakeMove.UNCHANGED:
            return
        active = self.queries.query(AgentWake).filter(session_agent_id=view.agent.agent_id, work_number=wake.work_number).matching(
            Excluding(Among("state", [state.value for state in ENDED_WAKE_STATES]))).first()
        state = WakeState.INHIBITED if wake.wake_move is WakeMove.INHIBITED else WakeState.OPEN
        if active is not None:
            causes = sorted({*json.loads(active.causes), *wake.causes})
            self.repository.save(active.changed(causes=json.dumps(causes), state=state if active.state in (WakeState.OPEN, WakeState.INHIBITED) else active.state), context)
            return
        if self.has_ended_wake(view.agent.agent_id, wake):
            return
        self.repository.save(AgentWake(session_agent_id=view.agent.agent_id, work_number=wake.work_number,
                                       session_number=view.session_number, causes=json.dumps(list(wake.causes)), state=state), context)

    # an expired wake stays final for its causes until a new cause, or a hook of the agent after it (doc 1310 section 6.4)
    def has_ended_wake(self, agent_id: int, wake: WakeChange) -> bool:
        expired = self.queries.query(AgentWake).filter(session_agent_id=agent_id, work_number=wake.work_number, state=WakeState.EXPIRED).newest().first()
        if expired is None or not set(wake.causes) <= set(json.loads(expired.causes)):
            return False
        hook = self.queries.query(HookCall).filter(session_agent_id=agent_id).newest().first()
        return hook is None or hook.creation_timestamp().value <= expired.update_timestamp().value
