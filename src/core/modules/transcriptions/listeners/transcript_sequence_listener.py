from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.documents.models.link import Link
from core.modules.sequences.commands.make_sequence.make_sequence import MakeSequence
from core.modules.sequences.commands.move_sequence_run.move_sequence_run import MoveSequenceRun, START
from core.modules.sequences.models.sequence import Sequence
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
from core.modules.tasks.models.task import Task
from core.modules.transcriptions.models.transcription import Transcription

SEQUENCE_TITLE = "Handle a transcript"
SEQUENCE_STEPS = (
    "Read the transcript whole with journal transcription show <n>; your task's brief names its number. Note who spoke, what was decided, what stays open and each piece of work named.",
    "Write the summary with journal doc make \"<title>\" --abstract \"<one line>\" --body \"<text>\": who spoke, what was decided, what stays open. For a meeting, write it as meeting notes.",
    "Write what else it calls for: a task for each piece of work named with journal task make, a plan when that work has an order, a document for anything longer. Do not start the work here.",
    "Link every row you made to the transcription with journal transcription link <n> <model> <number>, such as doc 3.",
    "Tell the user in the chat what you made from the transcript, then close your task with journal task close <task> --outcome \"<the rows you made>\".",
)


class TranscriptSequenceListener(CommitListener):
    """When an agent starts a task made for a transcription, the sequence that says how to handle a transcript starts
    for that agent, unless one is running; the sequence is made the first time it is needed."""

    name = "transcriptions.sequence"
    event = "task.start"

    def __init__(self, queries: Queries, runs: SequenceRunQuery, bus: Bus) -> None:
        self.queries, self.runs, self.bus = queries, runs, bus

    def handle(self, event: LoggedEvent) -> None:
        task = self.queries.query(Task).find(event.row_id)
        if task.holder_id is None or not self.is_transcript_task(task) or self.runs.current(task.holder_id) is not None:
            return
        holder = Actor(task.holder_id, ActorType.AGENT)
        self.bus.run(MoveSequenceRun(START, self.sequence_id(holder, event)), holder, cause_id=event.id, environment_id=event.environment_id)

    def is_transcript_task(self, task: Task) -> bool:
        return self.queries.query(Link).filter(source_model=Transcription.model_name, target_model=Task.model_name, target_id=task.id).exists()

    def sequence_id(self, holder: Actor, event: LoggedEvent) -> int:
        shipped = self.queries.query(Sequence).filter(title=SEQUENCE_TITLE).page(1, 1).rows
        if shipped:
            return shipped[0].id
        return self.bus.run(MakeSequence(SEQUENCE_TITLE, SEQUENCE_STEPS), holder, cause_id=event.id, environment_id=event.environment_id).id
