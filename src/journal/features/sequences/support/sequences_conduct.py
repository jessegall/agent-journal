from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.idle import Idle
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.support.command_part import CommandPart
from journal.features.sequences.support.sequences_data import SequencesData

SILENCE_SECONDS = 60.0


class SequencesConduct(Conduct):
    """The sequences feature's conduct in every state: a write waits while the step in hand is not taken up or has stood too long since it was, a stop with a step open is held with the step unless it was said since the agent last used a tool, a session that starts with a run is told its step or that the run is parked, a step unheard for the set minutes is typed again to a quiet agent, and the tool use that ends a wait is told the step again; nothing while the run is parked, a question to the user is open or the agent owes the journal."""

    def on_tool_starting_sequences(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.sequences.feature import Sequences
        runs = event.data.of(Sequences)
        if event.subagent or not runs.has_run() or runs.parked_why or is_step_command(runs, event.call.parts):
            return self.unchanged()
        if self.is_waiting() and runs.can_be_typed and not runs.question_open:
            return self.unchanged().typing(step_line(runs))
        if not event.call.writes or runs.debts_owed:
            return self.unchanged()
        if not runs.is_taken_up:
            return self.hold(Sequences.STEP_EDIT_BLOCK.create(n=runs.sequence_id, step=runs.step, text=runs.step_text))
        if runs.writes_since_taken_up >= int(settings.of(Sequences.STALENESS_LIMIT)):
            return self.hold(Sequences.STALE_STEP.create(writes=runs.writes_since_taken_up, n=runs.sequence_id, step=runs.step, text=runs.step_text))
        return self.unchanged()

    def on_idle_sequences(self, event: Idle, settings: Settings) -> Transition:
        from journal.features.sequences.feature import Sequences
        runs = event.data.of(Sequences)
        if not runs.has_run() or runs.parked_why or runs.question_open or runs.debts_owed or runs.step_said_after_last_tool or self.is_waiting():
            return self.unchanged()
        return self.hold(Sequences.PENDING_STEP.create(n=runs.sequence_id, step=runs.step, text=runs.step_text))

    def on_session_started_sequences(self, event: SessionStarted, settings: Settings) -> Transition:
        runs = event.data.of(sequences_feature())
        return self.unchanged(reminder_line(runs)) if runs.has_run() else self.unchanged()

    def on_ticked_sequences(self, event: Ticked, settings: Settings) -> Transition:
        runs = event.data.of(sequences_feature())
        if not runs.has_run() or runs.parked_why or runs.question_open or not runs.can_be_typed or event.quiet_for < SILENCE_SECONDS:
            return self.unchanged()
        if runs.step_unsaid_seconds < float(settings.of(sequences_feature().STEP_REPEAT_INTERVAL)) * 60:
            return self.unchanged()
        return self.unchanged().typing(reminder_line(runs))


def is_step_command(runs: SequencesData, parts: tuple[CommandPart, ...]) -> bool:
    from journal.support.run_tracker import RunTracker
    from journal.support.sequence_run import SequenceRun
    return bool(parts) and RunTracker.names(SequenceRun(sequence_id=runs.sequence_id, title="", steps=(runs.step_text,)), parts)


def step_line(runs: SequencesData) -> Nudge:
    return sequences_feature().PENDING_STEP.create(n=runs.sequence_id, step=runs.step, text=runs.step_text)


def reminder_line(runs: SequencesData) -> Nudge:
    if runs.parked_why:
        return sequences_feature().SEQUENCE_SUSPENDED.create(n=runs.sequence_id, step=runs.step, why=runs.parked_why)
    return step_line(runs)


def sequences_feature():
    from journal.features.sequences.feature import Sequences
    return Sequences
