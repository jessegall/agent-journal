import re

from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.chat.mark_outcome import MarkOutcome
from core.base.command.bus import Bus
from core.base.driver.project_paths import ProjectPaths
from core.base.driver.command_category import CommandCategory
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.chat.models.enums.chat_mark_state import ChatMarkState
from core.modules.processes.models.enums.process_mark_type import ProcessMarkType
from core.modules.processes.models.enums.process_mark_variant import ProcessMarkVariant
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.run_visibility import RunVisibility
from core.modules.processes.support.run_title import RunTitle
from core.base.change.touched import Touched

MODULE_NAME = "journal.core.processes"
LINE_CHARACTERS = 70
LAST_LINES = 5
OUTCOMES = {ProcessState.FINISHED: MarkOutcome.PASSED, ProcessState.FAILED: MarkOutcome.FAILED, ProcessState.STOPPED: MarkOutcome.WARNED, ProcessState.ORPHANED: MarkOutcome.FAILED}
PHRASES = {ProcessState.RUNNING: "Running", ProcessState.BACKGROUND: "Running", ProcessState.FINISHED: "Ran", ProcessState.FAILED: "Failed",
         ProcessState.STOPPED: "Stopped", ProcessState.ORPHANED: "Lost"}
ENDED = (ProcessState.FINISHED, ProcessState.FAILED, ProcessState.STOPPED, ProcessState.ORPHANED)
ACTOR_LABELS = {ActorType.AGENT: "The agent", ActorType.USER: "You"}


class ProcessEndMarkListener(CommitListener[Touched[Process]]):
    """A visible run shows one mark naming its command alone, whatever else its line runs; the mark is kept up
    to date in place by the key process:<id>: queued, running with the reader's progress as its figure, moved
    to the background, then ended with its outcome. A mark once shown always ends, also when the run's output
    is gone by then."""

    name = "processes.process-mark"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, folder: OutputFolder, visibility: RunVisibility) -> None:
        self.bus, self.actors, self.queries, self.folder, self.visibility = bus, actors, queries, folder, visibility

    def handle(self, event: Touched[Process], logged: LoggedEvent) -> None:
        process = self.queries.query(Process).filter(id=logged.row_id).first()
        if process is None:
            return
        key = f"process:{process.id}"
        shown = self.queries.query(ChatMark).filter(environment_id=process.environment_id, key=key).first()
        if shown is not None and shown.state is ChatMarkState.ENDED:
            return
        part = self.visibility.visible_part(process)
        if part is None:
            return
        output = next(self.queries.query(Output).filter(process_id=process.id).all_rows(), None)
        reader = self.queries.query(Reader).find(output.reader_id) if output and output.reader_id else None
        variant = ProcessMarkVariant.QUEUED if process.queued_at is not None else ProcessMarkVariant(process.state.value)
        figure = self.figure(process, output)
        text = self.text(process, output.title if output else "", ProjectPaths.relative_line(part.text, process.folder)[:LINE_CHARACTERS])
        if part.category is CommandCategory.TEST_RUN:
            text = RunTitle.tests(process, output, reader)
        outcome = OUTCOMES.get(process.state, MarkOutcome.RUNNING)
        if process.state in ENDED and output and reader:
            if reader.failed_pattern and re.search(reader.failed_pattern, self.folder.reader_text(process.id, output.reader_position), re.MULTILINE):
                outcome = MarkOutcome.FAILED
        self.bus.run(ShowMark(process.environment_id, ProcessMarkType.COMMAND, variant, key, text, agent_id=process.agent_id, detail=self.detail(process, logged),
                              row_model="process", row_id=process.id, outcome=outcome, figure=figure,
                              fraction=process.progress / 100 if process.state not in ENDED else 0.0, ended=process.state in ENDED),
                     self.actors.actor(MODULE_NAME), cause_id=logged.id, environment_id=process.environment_id)

    @staticmethod
    def text(process: Process, title: str, line: str) -> str:
        if process.queued_at is not None:
            return f"Queued: {title or line}"
        return title or f"{PHRASES[process.state]} {line}"

    @staticmethod
    def figure(process: Process, output: Output | None) -> str:
        if process.state in ENDED and output and output.reader_summary:
            return output.reader_summary
        if output and output.steps_failed:
            return f"{output.steps_passed} passed, {output.steps_failed} failed"
        if output and output.steps_passed:
            return f"{output.steps_passed} passed"
        return f"{process.progress}%" if process.progress and process.state not in ENDED else ""

    def detail(self, process: Process, logged: LoggedEvent) -> str:
        if process.state is not ProcessState.STOPPED:
            return "\n".join(self.folder.last_lines(process.id, LAST_LINES))
        if process.expired_at is not None:
            return f"It ran past its timeout of {process.timeout_seconds} seconds"
        return f"{ACTOR_LABELS.get(self.queries.query(ActorRecord).find(logged.actor_id).type, 'The journal')} stopped it"
