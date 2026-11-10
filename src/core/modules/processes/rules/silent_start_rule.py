from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.nudge import Nudge
from engine.driver.part import Part
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_nudges import SILENT_START_FIXED, SILENT_START_READY, SILENT_START_REFUSED, SILENT_START_TAUGHT
from core.modules.processes.support.reader_rows import ReaderRows
from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.run_shapes import RunShapes
from core.modules.processes.support.silent_start_runs import SilentStartRuns
from core.modules.processes.support.silent_run import SilentRun

UNKNOWN_SHAPE = "none of the known ones"
MISSING_TOTAL_TEXT = "states no total, so the command must print one first"
SILENT_RUN_LIMIT_COUNT = 2


class SilentStartRule(DriverRule):
    """Before an alias or a command runs again after a run that lasted over a minute and showed no percent in
    the chat, tells the agent once what its output looks like and that a reader fixes it; refuses the start
    after a second such run until a reader was made or changed since, or the agent skips once and says why;
    and says once that progress shows when a later run does."""

    name = "processes.silent-start"
    roles = [AgentRole.MAIN]
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    refuses_one_action = "A command that ran a minute with no percent shown is refused until a reader or a reason is given"

    def __init__(self, runs: SilentStartRuns, folder: OutputFolder, readers: ReaderRows) -> None:
        self.runs, self.folder, self.readers = runs, folder, readers

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        names = tuple(dict.fromkeys(SilentStartRuns.name(part.text, part.program, part.classification.category) for part in shell.parts if self.is_watched(part)))
        answers = [self.answer_name(name) for name in names]
        refused = next((answer for answer in answers if answer.refusal), None)
        if refused is not None:
            return refused
        return RuleAnswer.with_nudges(*(nudge for answer in answers for nudge in answer.nudges))

    @staticmethod
    def is_watched(part: Part) -> bool:
        return part.classification.category.is_watched

    def answer_name(self, name: str) -> RuleAnswer:
        runs = self.runs.runs(name)
        count = SilentStartRuns.silent_run_count(runs)
        if count >= SILENT_RUN_LIMIT_COUNT:
            return self.refusal(name, runs[0])
        if count:
            return RuleAnswer.with_nudges(self.taught(name, runs[0]))
        if len(runs) > 1 and runs[0].shows_percent and runs[1].is_silent:
            return RuleAnswer.with_nudges(SILENT_START_FIXED.nudge(name=name))
        return RuleAnswer.allowed()

    def taught(self, name: str, run: SilentRun) -> Nudge:
        shape = RunShapes.found(self.folder.all_output(run.process.id))
        return SILENT_START_TAUGHT.nudge(name=name, seconds=run.seconds, shape=shape.label if shape else UNKNOWN_SHAPE, hint=shape.total_note if shape else MISSING_TOTAL_TEXT)

    def refusal(self, name: str, run: SilentRun) -> RuleAnswer:
        if self.reader_changed_after(run):
            return RuleAnswer.allowed()
        refused = SILENT_START_REFUSED.nudge(name=name)
        shape = RunShapes.found(self.folder.all_output(run.process.id))
        if shape is None:
            return RuleAnswer.refused(refused)
        ready = SILENT_START_READY.nudge(name=name, shape=shape.label, reader=f'journal reader add {name.split()[-1]} --commands "{run.part.command or run.part.text}" --title "{name}" {shape.reader_options()}')
        return RuleAnswer(refusal=refused.text, nudges=(refused, ready), last=True)

    def reader_changed_after(self, run: SilentRun) -> bool:
        selected = ReaderSelection.choose(self.readers.all(), [run.part])
        return selected is not None and run.process.created_at is not None and selected.reader.update_timestamp().value > run.process.created_at.value
