import re

from engine.enums.actor_type import ActorType
from engine.change.logged_event import LoggedEvent
from engine.enums.mark_outcome import MarkOutcome
from engine.command.bus import Bus
from engine.driver.project_paths import ProjectPaths
from engine.enums.command_category import CommandCategory
from engine.change.event_subscriber import E
from engine.listener.commit_listener import CommitListener
from engine.listener.event_rows import EventRows
from engine.module.module_actors import ModuleActors
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.chat.models.enums.chat_mark_state import ChatMarkState
from core.modules.chat.queries.chat_mark_query import ChatMarkQuery
from core.modules.processes.models.enums.process_mark_type import ProcessMarkType
from core.modules.processes.models.enums.part_state import PartState
from core.modules.processes.models.enums.process_mark_variant import ProcessMarkVariant
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.run_visibility import RunVisibility
from core.modules.processes.support.run_title import RunTitle

MODULE_NAME = "journal.core.processes"
LINE_CHARACTERS = 70
END_MARK_LINE_COUNT = 5
OUTCOMES = {ProcessState.FINISHED: MarkOutcome.PASSED, ProcessState.FAILED: MarkOutcome.FAILED, ProcessState.STOPPED: MarkOutcome.WARNED, ProcessState.ORPHANED: MarkOutcome.FAILED}
PHRASES = {ProcessState.RUNNING: "Running", ProcessState.BACKGROUND: "Running", ProcessState.FINISHED: "Ran", ProcessState.FAILED: "Failed",
         ProcessState.STOPPED: "Stopped", ProcessState.ORPHANED: "Lost"}
ENDED = (ProcessState.FINISHED, ProcessState.FAILED, ProcessState.STOPPED, ProcessState.ORPHANED)
ACTOR_LABELS = {ActorType.AGENT: "The agent", ActorType.USER: "You"}


class ProcessMarkListener(CommitListener[E]):
    """Shows a visible run's one mark, naming its command alone, once the part it names has started. The mark
    is kept up to date in place by the key process:<id>: running with the reader's progress as its figure,
    moved to the background, then ended with its outcome. A mark once shown always ends, also when the output
    is gone."""

    def __init__(self, bus: Bus, actors: ModuleActors, folder: OutputFolder, visibility: RunVisibility, rows: EventRows, marks: ChatMarkQuery, outputs: OutputQuery) -> None:
        self.bus, self.actors, self.folder, self.visibility = bus, actors, folder, visibility
        self.rows = rows
        self.marks = marks
        self.outputs = outputs

    def show(self, process: Process, logged: LoggedEvent) -> None:
        if process.plugin:
            return
        key = f"process:{process.id}"
        shown = self.marks.keyed(key)
        if shown is not None and shown.state is ChatMarkState.ENDED:
            return
        part = self.visibility.visible_part(process)
        if part is None or (shown is None and part.state is PartState.WAITING):
            return
        output = self.outputs.process_output(process.id)
        reader = self.rows.required(Reader, output.reader_id) if output and output.reader_id else None
        variant = ProcessMarkVariant(process.state.value)
        figure = self.figure(process, output)
        text = self.text(process, output.title if output else "", ProjectPaths.relative_line(part.text, process.folder)[:LINE_CHARACTERS])
        if part.category is CommandCategory.TEST_RUN:
            text = RunTitle.tests(process, output, reader)
        outcome = OUTCOMES.get(process.state, MarkOutcome.RUNNING)
        if process.state in ENDED and output and reader:
            if reader.failed_pattern and re.search(reader.failed_pattern, self.folder.reader_text(process.id, output.reader_position), re.MULTILINE):
                outcome = MarkOutcome.FAILED
        self.bus.run(ShowMark(ProcessMarkType.COMMAND, variant, key, text, agent_id=process.session_agent_id, detail=self.detail(process, logged),
                              row_model="process", row_id=process.id, outcome=outcome, figure=figure,
                              fraction=process.progress / 100 if process.state not in ENDED else 0.0, ended=process.state in ENDED),
                     self.actors.actor(MODULE_NAME), cause_id=logged.id, environment_id=process.environment_id)

    @staticmethod
    def text(process: Process, title: str, line: str) -> str:
        return title or f"{PHRASES[process.state]} {line}"

    @classmethod
    def figure(cls, process: Process, output: Output | None) -> str:
        result = cls.result(process, output)
        if process.state not in ENDED or not process.duration_text():
            return result
        return f"{result} in {process.duration_text()}" if result else process.duration_text()

    @staticmethod
    def result(process: Process, output: Output | None) -> str:
        if process.state in ENDED and output and output.reader_summary:
            return output.reader_summary
        if output and output.steps_failed:
            return f"{output.steps_passed} passed, {output.steps_failed} failed"
        if output and output.steps_passed:
            return f"{output.steps_passed} passed"
        return f"{process.progress}%" if process.progress and process.state not in ENDED else ""

    def detail(self, process: Process, logged: LoggedEvent) -> str:
        if process.state is not ProcessState.STOPPED:
            return "\n".join(self.folder.last_lines(process.id, END_MARK_LINE_COUNT))
        if process.expired_at is not None:
            return f"It ran past its timeout of {process.timeout_seconds} seconds"
        return f"{ACTOR_LABELS.get(self.rows.required(ActorRecord, logged.actor_id).type, 'The journal')} stopped it"
