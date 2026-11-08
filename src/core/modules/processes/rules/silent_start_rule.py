from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge import Nudge
from core.base.driver.part import Part
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_nudges import SILENT_START_FIXED, SILENT_START_READY, SILENT_START_REFUSED, SILENT_START_TAUGHT
from core.modules.processes.support.reader_rows import ReaderRows
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.run_shape import RunShapes
from core.modules.processes.support.silent_runs import SilentRun, SilentRuns

NO_SHAPE = "none of the known ones"
NO_TOTAL = "states no total, so the command must print one first"
SILENT_STREAK_REFUSED = 2


class SilentStartRule(DriverRule):
    """Before an alias or a command runs again after a run that lasted over a minute and showed no percent in the
    chat, tells the agent once what its output looks like and that a reader fixes it; refuses the start after a
    second such run until a reader was made or changed since, or the agent skips once and says why; and says once
    that progress shows when a later run does."""

    name = "processes.silent-start"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, runs: SilentRuns, folder: OutputFolder, readers: ReaderRows) -> None:
        self.runs, self.folder, self.readers = runs, folder, readers

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        names = tuple(dict.fromkeys(SilentRuns.name(part.text, part.program, part.classification.category) for part in shell.parts if self.is_watched(part)))
        answers = [self.answer_for(name) for name in names]
        refused = next((answer for answer in answers if answer.refusal), None)
        if refused is not None:
            return refused
        return RuleAnswer.with_nudges(*(nudge for answer in answers for nudge in answer.nudges))

    @staticmethod
    def is_watched(part: Part) -> bool:
        return part.classification.category.is_watched

    def answer_for(self, name: str) -> RuleAnswer:
        runs = self.runs.runs(name)
        streak = SilentRuns.silent_streak(runs)
        if streak >= SILENT_STREAK_REFUSED:
            return self.refusal(name, runs[0])
        if streak:
            return RuleAnswer.with_nudges(self.taught(name, runs[0]))
        if len(runs) > 1 and runs[0].shows_percent and runs[1].is_silent:
            return RuleAnswer.with_nudges(SILENT_START_FIXED.nudge(name=name))
        return RuleAnswer.allowed()

    def taught(self, name: str, run: SilentRun) -> Nudge:
        shape = RunShapes.found(self.folder.all_output(run.process.id))
        return SILENT_START_TAUGHT.nudge(name=name, seconds=run.seconds, shape=shape.label if shape else NO_SHAPE, hint=shape.total_note if shape else NO_TOTAL)

    def refusal(self, name: str, run: SilentRun) -> RuleAnswer:
        if self.reader_changed_since(run):
            return RuleAnswer.allowed()
        refused = SILENT_START_REFUSED.nudge(name=name)
        shape = RunShapes.found(self.folder.all_output(run.process.id))
        if shape is None:
            return RuleAnswer.refused(refused)
        ready = SILENT_START_READY.nudge(name=name, shape=shape.label, reader=f'journal reader add {name.split()[-1]} --commands "{run.part.command or run.part.text}" --title "{name}" {shape.reader_options()}')
        return RuleAnswer(refusal=refused.text, nudges=(refused, ready), last=True)

    def reader_changed_since(self, run: SilentRun) -> bool:
        selected = ReaderSelection.choose(self.readers.all(), [run.part])
        return selected is not None and run.process.created_at is not None and selected.reader.update_timestamp().value > run.process.created_at.value
