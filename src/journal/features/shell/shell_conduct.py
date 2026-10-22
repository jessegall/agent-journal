from journal.engine.base_state import BaseState
from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.nudge import Nudge
from journal.engine.support.transition import Transition
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.features.shell.states.fixing_reader import FixingReader
from journal.features.shell.support.activity_label import ActivityLabel
from journal.features.shell.support.ended_output import EndedOutput
from journal.features.shell.support.output_view import OutputView
from journal.features.shell.support.watch_suggestions import LONG_RUNS
from journal.support.chain import Chain
from journal.support.command_shape import CommandShape
from journal.support.foreground_option import FOREGROUND_OPTION
from journal.support.moment import Moment
from journal.support.timeout import Timeout

SILENCE_SECONDS = 5.0
BACKGROUND_CHECK_DELAY_SECONDS = 300.0
ALIAS_RUNS = 3
READER_RUNS = 5
COUNTING_SUGGESTION_RUNS = 50
TESTING = "testing"
READER_REQUEST_COUNT = 3


class ShellConduct(Conduct):
    """The shell feature's conduct in every state: a file longer than the runner shows is read in parts, a journal command runs alone while an alias may chain, a read of an output by hand is pointed at a reader or asked to become one, a line an alias runs is pointed at the alias and a line run three times is asked to become one, a test run no counting reader reads is offered one on its first run and every fiftieth, the commands that ended in the background are named once the agent is quiet, one the agent waits on left to the wait, one running five minutes is looked at, and a watched output's view is said after every tool use until its command ends."""

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return Transition.merged(self, [journal_isolation_check(self, event, settings), partial_read_check(self, event, settings), readers_check(self, event, settings), alias_check(self, event, settings), reader_suggestion_check(self, event, settings), counting_reader_check(self, event, settings)])

    def on_tool_finished(self, event: ToolFinished, settings: Settings) -> Transition:
        from journal.features.shell.feature import Shell
        watch = event.data.part(Shell).watch
        if not watch.is_watching():
            return unread_check(self, event, settings)
        fix_lines = reader_fix(watch, event.data.part(Shell).tipped)
        if fix_lines and event.data.part(Shell).reader_requests.count(watch.reader) + 1 >= READER_REQUEST_COUNT:
            return reader_rewrite(self, event, watch)
        if watch.ending:
            return self.none(Shell.WATCH_ENDED.create(n=watch.output, ending=watch.ending, lines=watch.text()), *fix_lines)
        return self.none(Shell.WATCH_VIEW.create(n=watch.output, lines=watch.text()), *fix_lines)

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        return Transition.merged(self, [background_check(self, event, settings), ended_check(self, event, settings), unread_check(self, event, settings)])


def reader_rewrite(state: BaseState, event: ToolFinished, watch: OutputView) -> Transition:
    from journal.features.shell.feature import Shell
    reader = next((r for r in event.data.part(Shell).readers if r.name == watch.reader), None)
    return state.push(FixingReader(reader=watch.reader, reader_form=repr(reader)), *reader_fix(watch, ()), Shell.READER_REWRITE_REQUEST.create(reader=watch.reader))


def reader_fix(watch: OutputView, tipped: tuple[str, ...]) -> tuple[Nudge, ...]:
    from journal.features.shell.feature import Shell
    if any(f"output {watch.output}'s card" in tip_text for tip_text in tipped):
        return ()
    if watch.poor_line:
        return (Shell.READER_FIX.create(reader=watch.reader, n=watch.output, line=watch.poor_line[:120]),)
    if watch.empty_card:
        return (Shell.READER_DETAIL.create(reader=watch.reader, n=watch.output),)
    return ()


def outcome_text(ended: tuple[EndedOutput, ...]) -> str:
    outcomes: dict[str, list[int]] = {}
    for output in ended:
        outcomes.setdefault(output.ending, []).append(output.id)
    return "; ".join(f"output{'s' if len(ids) > 1 else ''} {', '.join(map(str, ids))} {outcome}" for outcome, ids in outcomes.items())


def partial_read_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    from journal.features.shell.feature import Shell
    cap = settings.integer(Shell.SHOWN)
    return state.refuse(Shell.PARTIAL_FILE_READ.create(lines=event.call.file_lines, cap=cap)) if event.call.file_lines > 2 * cap else state.none()


def journal_isolation_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    from journal.features.shell.feature import Shell
    journal, parts = event.call.journal_parts()
    return state.refuse(Shell.JOURNAL_COMMAND_ISOLATION.create()) if 0 < journal < parts else state.none()


def reader_suggestion_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    from journal.features.shell.feature import Shell
    shell = event.data.part(Shell)
    shape = event.call.recorded().shape
    if event.shape_runs < READER_RUNS or ActivityLabel.build(shape) not in LONG_RUNS or any(r.commands.is_read(event.call.command) for r in shell.readers):
        return state.none()
    tip = Shell.NEW_READER_SUGGESTION.create(command=shape)
    return state.none() if tip.rendered() in shell.tipped else state.none(tip)


def counting_reader_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    from journal.features.shell.feature import Shell
    shape = event.call.recorded().shape
    if ActivityLabel.build(shape) != TESTING or event.shape_runs % COUNTING_SUGGESTION_RUNS != 1:
        return state.none()
    if any(r.is_counting() and r.commands.is_read(event.call.command) for r in event.data.part(Shell).readers):
        return state.none()
    return state.none(Shell.COUNTING_READER_SUGGESTION.create(command=shape))


def alias_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    from journal.features.shell.feature import Shell
    shell = event.data.part(Shell)
    hints = [Shell.ALIAS_HINT.create(name=alias.name, line=part.text) for part in event.call.parts for alias in shell.aliases if alias.matches(part.text)]
    if hints:
        return state.none(hints[0])
    command, shape = event.call.command, event.call.recorded().shape
    if event.shape_runs < ALIAS_RUNS or Chain.is_journal(CommandShape.inner(command)) or Chain.is_read_line(command) or " " not in shape:
        return state.none()
    reader = next((r.name for r in shell.readers if r.commands.is_read(command)), "<the reader that reads its output>")
    tip = Shell.ALIAS_SUGGESTION.create(shape=shape, reader=f" --reader {reader}")
    return state.none() if tip.rendered() in shell.tipped else state.none(tip)


def readers_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    from journal.features.shell.feature import Shell
    reads = [part for part in event.call.parts if part.reads_output]
    if not reads:
        return state.none()
    shell = event.data.part(Shell)
    tips = [Shell.READER_HINT.create(reader=r.name, about=r.subject) for r in shell.readers if r.matches(reads[0].text)]
    if shell.output_reads.count(reads[0].read_shape) >= 2:
        tips.append(Shell.READER_SUGGESTION.create(command=reads[0].read_shape))
    new_tips = [tip for tip in tips if tip.rendered() not in shell.tipped]
    return state.none(new_tips[0]) if new_tips else state.none()


def ended_check(state: BaseState, event: Ticked, settings: Settings) -> Transition:
    from journal.features.shell.feature import Shell
    ended = event.data.part(Shell).unannounced
    if event.silence_seconds < SILENCE_SECONDS or not ended:
        return state.none()
    return state.none(Shell.OUTPUTS_ENDED.create(outputs=outcome_text(ended), n=ended[0].id))


def unread_check(state: BaseState, event: AgentEvent, settings: Settings) -> Transition:
    from journal.features.shell.feature import Shell
    shell = event.data.part(Shell)
    if event.subagent or not shell.unread or shell.unannounced:
        return state.none()
    interval = Timeout.tool_uses(settings.integer(Shell.UNREAD_OUTPUT_INTERVAL)).combined(Timeout.seconds(settings.integer(FOREGROUND_OPTION)))
    if not interval.reset(shell.last_ending_line).has_passed(Moment(seconds=event.time, tool_uses=shell.tool_uses)):
        return state.none()
    return state.none(Shell.UNREAD_OUTPUT.create(outputs=outcome_text(shell.unread), n=shell.unread[0].id))


def background_check(state: BaseState, event: Ticked, settings: Settings) -> Transition:
    from journal.features.shell.feature import Shell
    shell = event.data.part(Shell)
    if not shell.background or event.time - shell.backgrounded_at < BACKGROUND_CHECK_DELAY_SECONDS:
        return state.none()
    return state.none(Shell.BACKGROUND_CHECK.create(background_outputs=", ".join(str(n) for n in shell.background)))
