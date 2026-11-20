from engine.request.request_values import RequestValues
import re

from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.driver.part import Part
from engine.driver.shell_line import ShellLine
from core.modules.processes.support.reading.reading_answer import ReadingAnswer
from core.modules.processes.models.enums.reading_phase import ReadingPhase
from core.modules.processes.queries.reading_decision_query import ReadingDecisionQuery
from core.modules.processes.support.decisions.command_run_counts import CommandRunCounts
from core.modules.processes.support.decisions.reading_decider import PREVENT_AFTER_RUNS
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.agent_messages.redirected_run_message import RedirectedRunMessage
from core.modules.processes.agent_messages.read_refusal_message import ReadRefusalMessage
from core.modules.processes.agent_messages.silent_start_fixed_message import SilentStartFixedMessage
from core.modules.processes.agent_messages.silent_start_ready_message import SilentStartReadyMessage
from core.modules.processes.agent_messages.silent_start_refusal_message import SilentStartRefusalMessage
from core.modules.processes.agent_messages.silent_start_taught_message import SilentStartTaughtMessage
from core.modules.processes.support.reader_rows import ReaderRows
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.reader_judge import ReaderJudge
from engine.enums.command_category import CommandCategory
from core.modules.processes.support.unreadable.unreadable_mark_registry import UnreadableMarkRegistry
from core.modules.processes.support.run_shape import RunShape
from core.modules.processes.support.run_shapes import INSPECTED_CHARACTERS, RunShapes
from core.modules.processes.support.silent_run import SilentRun
from core.modules.processes.support.silent_start_runs import SilentStartRuns
from core.modules.agents.support.agent_rows import AgentRows


EXIT_COMMANDS = ("output read", "output peek", "output page", "output stop", "reader", "refusal skip", "command-type")
UNKNOWN_SHAPE = "none of the known ones"
MISSING_TOTAL_TEXT = "states no total, so the command must print one first"
SILENT_RUN_LIMIT_COUNT = 2
STANDARD_OUTPUT_REDIRECT = re.compile(r"(?:1?>>?|&>>?)\s*[^&\s]")


class ReadingEnforcer:
    """The one place that presses an agent about reading, at the start of a command, by its command
    key: after one silent run it teaches the shape found, after two it refuses the start until a
    reader is made or changed or the agent skips once with a reason, and says once that progress
    shows when a later run does; any other command that ended twice without a good reader is refused
    its next start with every exit stated. A command marked unreadable is asked nothing, and a
    command that takes an exit always passes."""

    def __init__(self, runs: SilentStartRuns, folder: OutputFolder, readers: ReaderRows, marks: UnreadableMarkRegistry, run_counts: CommandRunCounts, decisions: ReadingDecisionQuery,
                 request_values: RequestValues, agents: AgentRows) -> None:
        self.runs, self.folder, self.readers, self.marks, self.run_counts, self.decisions = runs, folder, readers, marks, run_counts, decisions
        self.request_values, self.agents = request_values, agents

    # read once a hook, so the refusal and the lines that come with it agree
    def answer(self, event: HookEvent, agent_id: int) -> ReadingAnswer:
        if not self.agents.is_main(agent_id):
            return ReadingAnswer()
        return self.request_values.read(f"processes.reading:{event.event_id}", lambda: event.event_id, lambda: self.found(event))

    def found(self, event: HookEvent) -> ReadingAnswer:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None or shell.parse_error or ReadingEnforcer.is_exit_command(event):
            return ReadingAnswer()
        redirected = list(dict.fromkeys(part.program for part in shell.parts if self.is_redirected(part, shell)))
        if redirected:
            return ReadingAnswer(RedirectedRunMessage.declared().agent_message(programs=', '.join(redirected)))
        names = tuple(dict.fromkeys(SilentStartRuns.name(part.text, part.program, part.classification.category) for part in shell.parts if self.is_watched(part)))
        answers = [self.answer_name(name) for name in names if not self.marks.excuses(name)]
        refused = next((answer for answer in answers if answer.refusal is not None), None)
        if refused is not None:
            return refused
        return ReadingAnswer(None, tuple(agent_message for answer in answers for agent_message in answer.agent_messages))

    @staticmethod
    def is_redirected(part: Part, shell: ShellLine) -> bool:
        return part.classification.category.is_watched and any(redirect in part.text and STANDARD_OUTPUT_REDIRECT.match(redirect) for redirect in shell.redirects)

    @staticmethod
    def is_watched(part: Part) -> bool:
        return part.classification.category.is_watched

    def answer_name(self, name: str) -> ReadingAnswer:
        runs = self.runs.runs(name)
        count = SilentStartRuns.silent_run_count(runs)
        if count >= SILENT_RUN_LIMIT_COUNT:
            return self.silent_refusal(name, runs[0])
        if count:
            return ReadingAnswer(None, (self.taught(name, runs[0]),))
        if len(runs) > 1 and runs[0].shows_percent and runs[1].is_silent:
            return ReadingAnswer(None, (SilentStartFixedMessage.declared().agent_message(name=name),))
        if self.run_counts.runs_without_reader([name])[name] >= PREVENT_AFTER_RUNS:
            return self.prevented(name)
        return ReadingAnswer()

    def shape(self, run: SilentRun) -> RunShape | None:
        return RunShapes.found(self.folder.head_output(run.process.id, INSPECTED_CHARACTERS))

    def taught(self, name: str, run: SilentRun) -> AgentMessage:
        shape = self.shape(run)
        return SilentStartTaughtMessage.declared().agent_message(name=name, seconds=run.seconds, shape=shape.label if shape else UNKNOWN_SHAPE, hint=shape.total_note if shape else MISSING_TOTAL_TEXT)

    def silent_refusal(self, name: str, run: SilentRun) -> ReadingAnswer:
        if self.reader_changed_after(run):
            return ReadingAnswer()
        refused = SilentStartRefusalMessage.declared().agent_message(name=name)
        shape = self.shape(run)
        if shape is None:
            return ReadingAnswer(refused)
        ready = SilentStartReadyMessage.declared().agent_message(name=name, shape=shape.label, reader=f'journal reader add {name.split()[-1]} --commands "{run.part.command or run.part.text}" --title "{name}" {shape.reader_options()}')
        return ReadingAnswer(refused, (ready,))

    def prevented(self, name: str) -> ReadingAnswer:
        last = self.decisions.command_key_decisions(name).filter(phase=ReadingPhase.END).descending("decided_at", "id").first()
        output = last.process_id if last is not None else 0
        return ReadingAnswer(ReadRefusalMessage.declared().agent_message(output=output, name=name, lacks=self.lacks(name, last.reason.value if last is not None else "")))

    # what the reader of a command lacks, so a refusal names the field to add and never only that something is wrong
    def lacks(self, name: str, reason: str) -> str:
        reader = next((reader for reader in self.readers.all() if ReaderSelection.matches(reader.commands, name)), None)
        if reader is None:
            return ""
        missing = ReaderJudge.fields_missing(reader, CommandCategory.TEST_RUN if reader.count_pattern or reader.progress_pattern else CommandCategory.UNKNOWN)
        return f" (reader {reader.id} lacks: {', '.join(missing)})" if missing else f" (reader {reader.id}: {reason})"

    def reader_changed_after(self, run: SilentRun) -> bool:
        selected = ReaderSelection.choose(self.readers.all(), [run.part], self.readers.layers())
        return selected is not None and run.process.created_at is not None and selected.reader.update_timestamp().value > run.process.created_at.value

    @staticmethod
    def is_exit_command(event: HookEvent) -> bool:
        shell = event.tool.shell if event.tool is not None else None
        return shell is not None and shell.is_journal_command_line(*EXIT_COMMANDS)
