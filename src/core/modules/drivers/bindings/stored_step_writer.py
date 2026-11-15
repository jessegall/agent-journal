import json
from collections.abc import Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.decision_record import DecisionRecord
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.record.block_closing import BlockClosing
from engine.agent_machine.record.wake_change import WakeChange
from engine.agent_machine.step_result import StepResult
from engine.agent_step.errors.required_effect_failure import RequiredEffectFailure
from engine.agent_step.frame_codec import FrameCodec
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
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.models.agent_escalation import AgentEscalation
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.models.agent_stack_move import AgentStackMove
from core.modules.drivers.models.agent_wake import AgentWake
from core.modules.drivers.models.driver_epoch import DriverEpoch
from core.modules.drivers.models.enums.wake_state import WakeState
from core.modules.drivers.models.program_epoch import ProgramEpoch

MACHINE_OPENER = "drivers.machine"
ENDED_WAKE_STATES = (WakeState.ACKNOWLEDGED, WakeState.CANCELLED, WakeState.EXPIRED)
STEP_CAUSE = "step"
CLOSED_BLOCKS_REASON = "a step closes the few blocks it judged ended"


class StoredStepWriter(StepWriter):
    """Saves a step in the write it is given, in the order of doc 1310 section 6.1: the answer basis is
    compared first and a change writes nothing; then the stack row and its moves, the blocks opened from
    plans and closed, the escalation, the unconditional effects each in its own savepoint, the admission
    effects when the step admits (a required one that fails raises and rolls everything back), and the
    wake. A step outside a hook that changed nothing writes nothing."""

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, database: Database) -> None:
        self.queries, self.repository, self.bus, self.database = queries, repository, bus, database

    def save(self, view: AgentView, step: StepResult, hook_call_id: int | None, context: Context) -> StepCommit:
        row = self.queries.query(AgentStack).filter(session_agent_id=view.agent.agent_id).first()
        if not self.basis_matches(row, view):
            return StepCommit.conflict()
        record = step.record
        if hook_call_id is None and not self.has_changes(view, step):
            return StepCommit.saved(None, ())
        row = self.saved_stack(row, view, step, context)
        for move in record.moves:
            self.repository.save(AgentStackMove(session_agent_id=view.agent.agent_id, move_type=move.move_type, frame_key=f"{move.frame_key.state_name}:{move.frame_key.generation}" if move.frame_key is not None else "",
                                                reason_text=move.reason_text, version_before=view.basis.stack_version, version_after=row.version,
                                                step_cause=STEP_CAUSE, hook_call_id=hook_call_id, frame_end=move.frame_end, actor_id=move.actor_id), context)
        self.open_blocks(record.blocks_opened, view, record, context)
        self.close_blocks(record.blocks_closed, context)
        self.save_escalation(view, record, context)
        failures = self.run_effects(record.unconditional_effects, view, record, False, context)
        if record.decision.admits():
            failures += self.run_effects(record.admission_effects, view, record, True, context)
        self.save_wake(view, record.wake, context)
        return StepCommit.saved(hook_call_id, tuple(failures))

    def basis_matches(self, row: AgentStack | None, view: AgentView) -> bool:
        driver_epoch = self.queries.query(DriverEpoch).first()
        program_epoch = self.queries.query(ProgramEpoch).filter(program=view.program_name).first()
        current = (row.version if row is not None else 0, driver_epoch.epoch if driver_epoch is not None else 0,
                   program_epoch.epoch if program_epoch is not None else 0)
        return current == (view.basis.stack_version, view.basis.driver_epoch, view.basis.program_epoch)

    @staticmethod
    def has_changes(view: AgentView, step: StepResult) -> bool:
        record = step.record
        changed_counts = (record.counts.stop_refusals, record.counts.tool_refusals) != (view.counts.stop_refusals, view.counts.tool_refusals)
        is_first_step = view.basis.stack_version == 0
        return bool(is_first_step or record.moves or record.blocks_opened or record.blocks_closed or changed_counts or record.counts.escalation != view.escalation
                    or record.wake.wake_move is not WakeMove.UNCHANGED or step.stack != view.stack)

    def saved_stack(self, row: AgentStack | None, view: AgentView, step: StepResult, context: Context) -> AgentStack:
        values = {"driver_name": view.driver_name, "table_digest": view.table_digest, "pinned_slices": view.pinned_slices,
                  "frames": FrameCodec.encoded(step.stack.frames), "stop_refusals": step.record.counts.stop_refusals,
                  "tool_refusals": step.record.counts.tool_refusals}
        stack = row.changed(**values) if row is not None else AgentStack(session_agent_id=view.agent.agent_id, **values)
        return self.repository.save(stack, context)

    def open_blocks(self, plans: Sequence[BlockPlan], view: AgentView, record: DecisionRecord, context: Context) -> None:
        for plan in plans:
            self.repository.save(AgentBlock(session_agent_id=view.agent.agent_id, creator_id=view.agent.agent_id, nudge_key=plan.nudge.key,
                                            nudge_text=plan.nudge.text, condition_name=type(plan.condition).name, condition_text=plan.condition.text,
                                            grace_tool_uses=plan.tool_grace_uses, blocks_stop=plan.scope_stop and not plan.scope_tools, strict=plan.is_strict,
                                            scope_tools=plan.scope_tools, scope_stop=plan.scope_stop, stop_grace_seconds=plan.stop_grace_seconds,
                                            subject_model=plan.subject.model if plan.subject is not None else "",
                                            subject_id=plan.subject.row_id if plan.subject is not None else None, members=plan.members,
                                            context_generation=plan.context_generation, lifting_lines=plan.lifting_lines,
                                            closer_roles=tuple(role.value for role in plan.closer_roles), opener=MACHINE_OPENER,
                                            opening_firing=record.identity.firing), context)

    def close_blocks(self, closings: Sequence[BlockClosing], context: Context) -> None:
        rows = {row.id: row for row in self.queries.query(AgentBlock).matching(Among("id", [closing.block_id for closing in closings])).every_row(CLOSED_BLOCKS_REASON)}
        for closing in closings:
            row = rows[closing.block_id]
            self.repository.save(row.changed(closed_at=context.timestamp, closed_reason=closing.block_end.value, closer=closing.closer,
                                             closing_evidence=closing.closing_evidence), context)

    def save_escalation(self, view: AgentView, record: DecisionRecord, context: Context) -> None:
        escalation = record.counts.escalation
        if escalation is None or escalation == view.escalation:
            return
        if escalation.escalation_id:
            row = self.queries.query(AgentEscalation).find(escalation.escalation_id)
            self.repository.save(row.changed(block_ids=escalation.block_ids, refusal_count=escalation.refusal_count), context)
            return
        self.repository.save(AgentEscalation(session_agent_id=view.agent.agent_id, escalation_type=escalation.escalation_type,
                                             responder=escalation.responder, refusal_count=escalation.refusal_count, block_ids=escalation.block_ids,
                                             work_keys=tuple(key.generation for key in escalation.work_keys)), context)

    def run_effects(self, effects: Sequence[Effect], view: AgentView, record: DecisionRecord, is_admission: bool, context: Context) -> list[str]:
        failures = []
        for effect in effects:
            for command in effect.commands(view, record):
                try:
                    with self.database.savepoint(type(command).__name__):
                        self.bus.dispatch(command, context.nested(command))
                except Refusal as refusal:
                    if is_admission and effect.is_required:
                        raise RequiredEffectFailure(f"{type(effect).__name__} failed: {refusal}") from refusal
                    failures.append(f"the journal could not run {type(command).__name__}: {refusal}")
        return failures

    def save_wake(self, view: AgentView, wake: WakeChange, context: Context) -> None:
        if wake.wake_move is WakeMove.UNCHANGED:
            return
        active = self.queries.query(AgentWake).filter(session_agent_id=view.agent.agent_id, work_generation=wake.work_generation).matching(
            Excluding(Among("state", [state.value for state in ENDED_WAKE_STATES]))).first()
        state = WakeState.INHIBITED if wake.wake_move is WakeMove.INHIBITED else WakeState.OPEN
        if active is not None:
            causes = sorted({*json.loads(active.causes), *wake.causes})
            self.repository.save(active.changed(causes=json.dumps(causes), state=state if active.state in (WakeState.OPEN, WakeState.INHIBITED) else active.state), context)
            return
        self.repository.save(AgentWake(session_agent_id=view.agent.agent_id, work_generation=wake.work_generation,
                                       session_generation=view.session_generation, causes=json.dumps(list(wake.causes)), state=state), context)
