import re

from engine.driver.agent_hook import AgentHook
from engine.driver.nudge import Nudge
from engine.driver.part import Part
from engine.driver.shell_line import ShellLine
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.queries.reading_decision_query import ReadingDecisionQuery
from core.modules.processes.support.decisions.escalation_counter import EscalationCounter
from core.modules.processes.support.decisions.reading_decider import PREVENT_AFTER_RUNS
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_nudges import REDIRECTED_RUN, READING_PREVENTED, SILENT_START_FIXED, SILENT_START_READY, SILENT_START_REFUSED, SILENT_START_TAUGHT
from core.modules.processes.support.reader_rows import ReaderRows
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.unreadable.unreadable_marks import UnreadableMarks
from core.modules.processes.support.run_shape import RunShape
from core.modules.processes.support.run_shapes import INSPECTED_CHARACTERS, RunShapes
from core.modules.processes.support.silent_run import SilentRun
from core.modules.processes.support.silent_start_runs import SilentStartRuns

EXIT_COMMANDS = ("output read", "output peek", "output page", "output stop", "reader", "refusal skip", "command-type")
UNKNOWN_SHAPE = "none of the known ones"
MISSING_TOTAL_TEXT = "states no total, so the command must print one first"
SILENT_RUN_LIMIT_COUNT = 2
STANDARD_OUTPUT_REDIRECT = re.compile(r"(?:1?>>?|&>>?)\s*[^&\s]")


class ReadingEnforcer:
    """The one place that presses an agent about reading, at the start of a command, by its command key: after one
    silent run it teaches the shape found, after two it refuses the start until a reader is made or changed or the
    agent skips once with a reason, and says once that progress shows when a later run does; any other command
    that ended twice without a good reader is refused its next start with every exit stated. A command marked
    unreadable is asked nothing, and a command that takes an exit always passes."""

    def __init__(self, runs: SilentStartRuns, folder: OutputFolder, readers: ReaderRows, marks: UnreadableMarks, counter: EscalationCounter, decisions: ReadingDecisionQuery) -> None:
        self.runs, self.folder, self.readers, self.marks, self.counter, self.decisions = runs, folder, readers, marks, counter, decisions

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error or ReadingEnforcer.answers_exit(hook):
            return RuleAnswer.allowed()
        redirected = list(dict.fromkeys(part.program for part in shell.parts if self.is_redirected(part, shell)))
        if redirected:
            return RuleAnswer.refused(REDIRECTED_RUN.nudge(programs=', '.join(redirected)))
        names = tuple(dict.fromkeys(SilentStartRuns.name(part.text, part.program, part.classification.category) for part in shell.parts if self.is_watched(part)))
        answers = [self.answer_name(name) for name in names if not self.marks.excuses(name)]
        refused = next((answer for answer in answers if answer.refusal), None)
        if refused is not None:
            return refused
        return RuleAnswer.with_nudges(*(nudge for answer in answers for nudge in answer.nudges))

    @staticmethod
    def is_redirected(part: Part, shell: ShellLine) -> bool:
        """Whether a test run, a build or a check of the line sends its output to a file or to /dev/null, which no
        reader would see; its exit is to run it without the redirect."""
        return part.classification.category.is_watched and any(redirect in part.text and STANDARD_OUTPUT_REDIRECT.match(redirect) for redirect in shell.redirects)

    @staticmethod
    def is_watched(part: Part) -> bool:
        return part.classification.category.is_watched

    def answer_name(self, name: str) -> RuleAnswer:
        runs = self.runs.runs(name)
        count = SilentStartRuns.silent_run_count(runs)
        if count >= SILENT_RUN_LIMIT_COUNT:
            return self.silent_refusal(name, runs[0])
        if count:
            return RuleAnswer.with_nudges(self.taught(name, runs[0]))
        if len(runs) > 1 and runs[0].shows_percent and runs[1].is_silent:
            return RuleAnswer.with_nudges(SILENT_START_FIXED.nudge(name=name))
        if self.counter.runs_without_change([name])[name] >= PREVENT_AFTER_RUNS:
            return self.prevented(name)
        return RuleAnswer.allowed()

    def shape(self, run: SilentRun) -> RunShape | None:
        """The shape of a run's output, found in the first characters a shape is looked for in, so a long output is never read whole."""
        return RunShapes.found(self.folder.head_output(run.process.id, INSPECTED_CHARACTERS))

    def taught(self, name: str, run: SilentRun) -> Nudge:
        shape = self.shape(run)
        return SILENT_START_TAUGHT.nudge(name=name, seconds=run.seconds, shape=shape.label if shape else UNKNOWN_SHAPE, hint=shape.total_note if shape else MISSING_TOTAL_TEXT)

    def silent_refusal(self, name: str, run: SilentRun) -> RuleAnswer:
        if self.reader_changed_after(run):
            return RuleAnswer.allowed()
        refused = SILENT_START_REFUSED.nudge(name=name)
        shape = self.shape(run)
        if shape is None:
            return RuleAnswer.refused(refused)
        ready = SILENT_START_READY.nudge(name=name, shape=shape.label, reader=f'journal reader add {name.split()[-1]} --commands "{run.part.command or run.part.text}" --title "{name}" {shape.reader_options()}')
        return RuleAnswer(refusal=refused.text, nudges=(refused, ready), last=True)

    def prevented(self, name: str) -> RuleAnswer:
        """The start of a command that ended twice without a good reader is refused, naming the last of those runs
        and every exit of a prevent."""
        last = self.decisions.for_command_key(name).filter(moment=ReadingMoment.END).descending("decided_at", "id").first()
        output = last.process_id if last is not None else 0
        return RuleAnswer.refused(READING_PREVENTED.nudge(output=output, name=name))

    def reader_changed_after(self, run: SilentRun) -> bool:
        selected = ReaderSelection.choose(self.readers.all(), [run.part], self.readers.layers())
        return selected is not None and run.process.created_at is not None and selected.reader.update_timestamp().value > run.process.created_at.value

    @staticmethod
    def answers_exit(hook: AgentHook) -> bool:
        """Whether the hook runs only commands that take an exit: reading or stopping the run, writing or marking a
        reader, skipping, or saying what type a command is."""
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        return shell is not None and shell.is_journal_command_line(*EXIT_COMMANDS)
