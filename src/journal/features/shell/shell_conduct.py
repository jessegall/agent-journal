import re

from journal.engine.base_state import BaseState
from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.nudge import Nudge
from journal.features.shell.support.titled_run import TitledRun
from journal.engine.support.transition import Transition
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.command_ended import CommandEnded
from journal.events.rows.output_full_bar import OutputFullBar
from journal.events.rows.silent_output_found import SilentOutputFound
from journal.events.rows.output_total_missing import OutputTotalMissing
from journal.events.rows.reader_report_judged import ReaderReportJudged
from journal.events.rows.reader_report_raised import ReaderReportRaised
from journal.events.agent.stop import Stop
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent.tool_starting import ToolStarting
from journal.features.shell.support.ended_output import EndedOutput
from journal.features.shell.support.folder_change import FolderChange
from journal.features.shell.support.project_paths import ProjectPaths
from journal.features.shell.support.piped_journal_command import PipedJournalCommand
from journal.features.shell.support.piped_test_run import PipedTestRun
from journal.models.alias import Alias
from journal.support.alias_call import AliasCall
from journal.support.tool_call import ToolCall
from journal.features.shell.support.reader import Reader
from journal.support.chain import Chain
from journal.support.foreground_option import FOREGROUND_OPTION
from journal.support.moment import Moment
from journal.support.timeout import Timeout
from journal.features.shell.shell_nudges import ShellNudges
from journal.features.shell.support.output_view import OutputView
from journal.features.shell.shell_options import ShellOptions
from journal.features.shell.shell_part import ShellPart
from journal.features.shell.support.shell_data import ShellData

# the output a journal output command names: journal output show 21620
OUTPUT_NUMBER = re.compile(r"\boutput\s+[a-z-]+\s+(\d+)")
SLEEP_LINE = re.compile(r"^\s*sleep\s+\d+(?:\.\d+)?[smhd]?\s*$")

SILENCE_SECONDS = 5.0
BACKGROUND_CHECK_DELAY_SECONDS = 300.0
ALIAS_RUNS = 3


class ShellConduct(Conduct):
    """The shell feature's conduct in every state: a sleep with nothing to wait on is refused, a file longer than the runner shows is read in parts, a shell loop that only polls journal commands is refused with the await that waits instead, a journal command runs alone while an alias may chain, a test run piped into a filter is refused, a cd that would leave the shell outside its environment's folder is refused, a read of an output by hand is pointed at the reader that reads it, a line an alias runs, typed by hand or through a wider alias, is refused with the alias, and a line run three times is asked to become one, a command that ended in the background is named once, at its end, as one line through the delivery queue, with one reader said for it, a watched one with its last view, one the agent waits on left to the wait, one running five minutes is looked at, a stop with one of the agent's own still running refused unless the agent waits on it, and a watched output's view is sent after every tool use until its command ends; a watched card that has shown nothing for 30 seconds is named once, after a tool use or while the agent waits."""

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        outputs = event.data.part(ShellPart).background
        if self.is_waiting() or self.blocks_tools() or not outputs:
            return self.none()
        return self.refuse(ShellNudges.OPEN_OUTPUT_STOP.create(outputs=", ".join(str(n) for n in outputs)))

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return Transition.merged(self, [sleep_line_check(self, event, settings), journal_poll_check(self, event, settings), journal_isolation_check(self, event, settings), piped_test_check(self, event, settings), piped_journal_check(self, event, settings), folder_change_check(self, event, settings), project_path_check(self, event, settings), partial_read_check(self, event, settings), readers_check(self, event, settings), alias_check(self, event, settings)])

    def on_tool_finished(self, event: ToolFinished, settings: Settings) -> Transition:
        watch = event.data.part(ShellPart).watch
        if not watch.is_watching():
            return Transition.merged(self, [unread_check(self, event, settings), run_title_check(self, event, settings)])
        if watch.ending or not watch.is_new_progress():
            return self.none()
        return self.none(ShellNudges.WATCH_VIEW.create(n=watch.output, progress=watch.progress(), fraction=watch.fraction))

    def on_command_ended(self, event: CommandEnded, settings: Settings) -> Transition:
        shell = event.data.part(ShellPart)
        ended = next((output for output in shell.unannounced if output.id == event.output), None)
        if ended is None:
            return self.none()
        watch = shell.watch
        if watch.output == event.output:
            return self.none(ShellNudges.WATCH_ENDED.create(n=watch.output, outcome=watch.outcome(ended.ending)), *reader_draft(shell, {event.output}, settings))
        return self.none(ShellNudges.OUTPUTS_ENDED.create(n=ended.id, outcome=OutputView.empty().outcome(ended.ending)), *reader_draft(shell, {event.output}, settings))

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        return Transition.merged(self, [background_check(self, event, settings), unread_check(self, event, settings), run_title_check(self, event, settings)])

    def on_output_total_missing(self, event: OutputTotalMissing, settings: Settings) -> Transition:
        nudge = ShellNudges.RUN_COUNT_UNSHOWN.create(n=event.row_id, pattern=event.count_pattern) if event.count_pattern else ShellNudges.RUN_TOTAL_MISSING.create(n=event.row_id)
        return self.none(nudge) if event.run_session == event.session else self.none()

    def on_silent_output_found(self, event: SilentOutputFound, settings: Settings) -> Transition:
        return self.none(ShellNudges.SILENT_RUN_HINT.create(n=event.row_id, seconds=event.silence_seconds)) if event.run_session == event.session else self.none()

    def on_output_full_bar(self, event: OutputFullBar, settings: Settings) -> Transition:
        return self.none(ShellNudges.COMPLETE_PROGRESS_RUN.create(n=event.row_id, seconds=event.full_seconds)) if event.run_session == event.session else self.none()

    def on_reader_report_raised(self, event: ReaderReportRaised, settings: Settings) -> Transition:
        return self.none(ShellNudges.REPORT_RAISED.create(n=event.row_id)) if event.run_session == event.session and event.reader not in event.data.part(ShellPart).locked_readers else self.none()

    def on_reader_report_judged(self, event: ReaderReportJudged, settings: Settings) -> Transition:
        if event.is_sound or event.run_session != event.session:
            return self.none()
        return self.none(ShellNudges.REPORT_REFUTED.create(verdicts=f"reader report {event.row_id}: {event.reason}"))


# the times the shown lines a file read in one go may hold before it must be read in parts
READ_LIMIT_FACTOR = 2


def outcome_text(ended: tuple[EndedOutput, ...]) -> str:
    outcomes: dict[str, list[int]] = {}
    for output in ended:
        if output.summary is None:
            outcomes.setdefault(output.ending, []).append(output.id)
    grouped = [f"output{'s' if len(ids) > 1 else ''} {', '.join(map(str, ids))} {outcome}" for outcome, ids in outcomes.items()]
    return "; ".join([*grouped, *(f"output {output.id} {output.ending}: {output.summary}" for output in ended if output.summary is not None)])


def partial_read_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    cap = settings.integer(ShellOptions.SHOWN)
    return state.refuse(ShellNudges.PARTIAL_FILE_READ.create(lines=event.call.file_lines, cap=cap)) if event.call.file_lines > READ_LIMIT_FACTOR * cap else state.none()


def sleep_line_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    parts = [part.text for part in event.call.parts]
    return state.refuse(ShellNudges.SLEEP_LINE_REFUSAL.create()) if parts and all(SLEEP_LINE.match(part) for part in parts) else state.none()


def journal_poll_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    if not Chain.is_journal_poll([part.text for part in event.call.parts]):
        return state.none()
    polled = OUTPUT_NUMBER.search(event.call.command)
    return state.refuse(ShellNudges.JOURNAL_POLL.create(n=polled[1] if polled else "<n>"))


def journal_isolation_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    journal, parts = event.call.journal_parts()
    return state.refuse(ShellNudges.JOURNAL_COMMAND_ISOLATION.create()) if 0 < journal < parts else state.none()


def folder_change_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    changes = FolderChange.targets([part.text for part in event.call.parts])
    if not changes:
        return state.none()
    home = event.data.part(ShellPart).home
    targets = [target for target in changes if not FolderChange.is_home(target, home)]
    return state.refuse(ShellNudges.FOLDER_CHANGE_REFUSAL.create(target=targets[0], home=home)) if targets else state.none()


def project_path_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    if not event.call.parts:
        return state.none()
    relative = ProjectPaths.relative_line(event.call.command, event.data.part(ShellPart).home)
    return state.refuse(ShellNudges.PROJECT_PATH_REFUSAL.create(line=relative)) if relative != event.call.command else state.none()


def is_read(reader: Reader, call: ToolCall) -> bool:
    return any(reader.commands.reads(part.shape) for part in call.parts)


def alias_refusals(text: str, aliases: tuple[Alias, ...]) -> list[Nudge]:
    call = AliasCall.parsed(text)
    called = [alias for alias in aliases if alias.name == call.name]
    if called:
        line = called[0].expanded(call.args)
        return [ShellNudges.MORE_SPECIFIC_ALIAS.create(name=alias.name, called=called[0].name, line=line) for alias in covering_aliases(line, aliases, called[0].head_size())]
    if Chain.is_journal(text):
        return []
    return [ShellNudges.ALIASED_LINE.create(name=alias.name, line=text) for alias in covering_aliases(text, aliases, -1)]


def covering_aliases(line: str, aliases: tuple[Alias, ...], head_size: int) -> list[Alias]:
    return sorted((alias for alias in aliases if alias.starts(line) and alias.head_size() > head_size), key=lambda alias: -alias.head_size())


def piped_test_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    program = PipedTestRun.piped_filter(event.call.parts, {alias.name: alias for alias in event.data.part(ShellPart).aliases})
    return state.refuse(ShellNudges.PIPED_TEST_RUN.create(filter=program)) if program else state.none()


def piped_journal_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    cut = PipedJournalCommand.piped(event.call.command, event.data.part(ShellPart).uncut_verbs)
    return state.refuse(ShellNudges.PIPED_JOURNAL_COMMAND.create(command=cut[0], filter=cut[1])) if cut else state.none()


def alias_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    shell = event.data.part(ShellPart)
    refusals = [refusal for part in event.call.parts for refusal in alias_refusals(part.text, shell.aliases)]
    if refusals:
        return state.refuse(refusals[0])
    command, shape = event.call.command, event.call.recorded().shape
    if not Timeout.tool_uses(ALIAS_RUNS).is_elapsed(event.shape_runs) or bool(event.call.parts) and Chain.is_journal(event.call.parts[0].text) or event.call.is_read() or " " not in shape:
        return state.none()
    reader = next((r.name for r in shell.readers if is_read(r, event.call)), "<the reader that reads its output>")
    tip = ShellNudges.ALIAS_SUGGESTION.create(shape=shape, reader=f" --reader {reader}")
    return state.none() if tip.rendered() in shell.tipped else state.none(tip)


def readers_check(state: BaseState, event: ToolStarting, settings: Settings) -> Transition:
    reads = [part for part in event.call.parts if part.reads_output]
    if not reads:
        return state.none()
    shell = event.data.part(ShellPart)
    tips = [ShellNudges.READER_HINT.create(reader=r.name, about=r.subject) for r in shell.readers if r.matches(reads[0].text)]
    new_tips = [tip for tip in tips if tip.rendered() not in shell.tipped]
    return state.none(new_tips[0]) if new_tips else state.none()


def reader_draft(shell: ShellData, outputs: set[int], settings: Settings) -> list[Nudge]:
    draft = next((draft for draft in shell.reader_drafts if draft.output in outputs and draft.is_suggestible(settings.integer(ShellOptions.READER_SUGGESTION_RUNS))), None)
    if draft is None or shell.draft_count >= settings.integer(ShellOptions.READER_SUGGESTIONS):
        return []
    return [ShellNudges.READER_DRAFT.create(part=draft.part, command=draft.command)]


def unread_check(state: BaseState, event: AgentEvent, settings: Settings) -> Transition:
    shell = event.data.part(ShellPart)
    if event.subagent or not shell.unread or shell.unannounced:
        return state.none()
    interval = Timeout.tool_uses(settings.integer(ShellOptions.UNREAD_OUTPUT_INTERVAL)).combined(Timeout.seconds(settings.integer(FOREGROUND_OPTION)))
    if not interval.reset(shell.last_ending_line).has_passed(Moment(seconds=event.time, tool_uses=shell.tool_uses)):
        return state.none()
    return state.none(ShellNudges.UNREAD_OUTPUT.create(outputs=outcome_text(shell.unread), n=shell.unread[0].id))


def background_check(state: BaseState, event: Ticked, settings: Settings) -> Transition:
    shell = event.data.part(ShellPart)
    if not shell.background or not Timeout.seconds(BACKGROUND_CHECK_DELAY_SECONDS).started(shell.backgrounded_at).is_elapsed(event.time):
        return state.none()
    return state.none(ShellNudges.BACKGROUND_CHECK.create(background_outputs=", ".join(str(n) for n in shell.background)))


def shared_title_tips(runs: tuple[TitledRun, ...]) -> list[Nudge]:
    return [ShellNudges.SHARED_TITLE.create(n=renamed.id, card_title=renamed.title, first_line=first.line, second_line=run.line) for i, run in enumerate(runs) for first in runs[:i] if first.clashes(run) and (renamed := retitled_run(first, run))]


def retitled_run(first: TitledRun, second: TitledRun) -> TitledRun | None:
    return next((run for run in (second, first) if run.is_running), None)


def run_title_check(state: BaseState, event: AgentEvent, settings: Settings) -> Transition:
    shell = event.data.part(ShellPart)
    tips = [*(ShellNudges.FLAGGED_TITLE.create(n=run.id, card_title=run.title) for run in shell.titled_runs if run.is_flagged()), *shared_title_tips(shell.recent_runs)]
    new_tips = [tip for tip in tips if tip.rendered() not in shell.tipped]
    return state.none(new_tips[0]) if new_tips else state.none()
