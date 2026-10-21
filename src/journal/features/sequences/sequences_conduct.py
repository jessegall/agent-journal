from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.stop import Stop
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.support.command_part import CommandPart
from journal.features.sequences.support.sequences_data import SequencesData

SILENCE_SECONDS = 60.0


class SequencesConduct(Conduct):
    """The sequences feature's conduct in every state: a write waits while the step in hand is not taken up or has stood too long since it was, a stop with a step open is held with the step unless it was said since the agent last used a tool, a session that starts with a run is told its step or that the run is parked, a step unheard for the set minutes is typed again to a quiet agent, and the tool use that ends a wait is told the step again; nothing while the run is parked, a question to the user is open or the agent owes the journal."""

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.sequences.feature import Sequences
        runs = event.data.part(Sequences)
        if event.subagent or not runs.has_run() or runs.suspension_reason or is_step_command(runs, event.call.parts):
            return self.none()
        if self.is_waiting() and runs.is_typable and not runs.question_open:
            return self.none().typing(step_line(runs))
        if not event.call.writes or runs.obligations_due:
            return self.none()
        if not runs.is_adopted:
            return self.refuse(Sequences.STEP_EDIT_BLOCK.create(n=runs.sequence_id, step=runs.step, text=runs.step_text))
        if runs.adoption_edits >= int(settings.value(Sequences.STALENESS_LIMIT)):
            return self.refuse(Sequences.STALE_STEP.create(writes=runs.adoption_edits, n=runs.sequence_id, step=runs.step, text=runs.step_text))
        return self.none()

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        from journal.features.sequences.feature import Sequences
        runs = event.data.part(Sequences)
        if not runs.has_run() or runs.suspension_reason or runs.question_open or runs.obligations_due or runs.step_repeated or self.is_waiting():
            return self.none()
        return self.refuse(Sequences.PENDING_STEP.create(n=runs.sequence_id, step=runs.step, text=runs.step_text))

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        runs = event.data.part(sequences_feature())
        return self.none(reminder_line(runs)) if runs.has_run() else self.none()

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        runs = event.data.part(sequences_feature())
        if not runs.has_run() or runs.suspension_reason or runs.question_open or not runs.is_typable or event.silence_seconds < SILENCE_SECONDS:
            return self.none()
        if runs.step_silence_seconds < float(settings.value(sequences_feature().STEP_REPEAT_INTERVAL)) * 60:
            return self.none()
        return self.none().typing(reminder_line(runs))


def is_step_command(runs: SequencesData, parts: tuple[CommandPart, ...]) -> bool:
    from journal.features.sequences.support.run_tracker import RunTracker
    from journal.support.sequence_run import SequenceRun
    return bool(parts) and RunTracker.names(SequenceRun(sequence_id=runs.sequence_id, title="", steps=(runs.step_text,)), parts)


def step_line(runs: SequencesData) -> Nudge:
    return sequences_feature().PENDING_STEP.create(n=runs.sequence_id, step=runs.step, text=runs.step_text)


def reminder_line(runs: SequencesData) -> Nudge:
    if runs.suspension_reason:
        return sequences_feature().SEQUENCE_SUSPENDED.create(n=runs.sequence_id, step=runs.step, why=runs.suspension_reason)
    return step_line(runs)


def sequences_feature():
    from journal.features.sequences.feature import Sequences
    return Sequences
