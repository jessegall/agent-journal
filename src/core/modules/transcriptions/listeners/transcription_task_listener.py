from engine.enums.actor_type import ActorType
from engine.listener.save_listener import SaveListener
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from engine.repository.repository import Repository
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.support.row_link_writer import RowLinkWriter
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.support.task_priority import URGENT_PRIORITY
from core.modules.tasks.models.task import Task
from core.modules.transcriptions.models.transcription import Transcription
from core.modules.drivers.support.main_agent_line import MainAgentLine
from core.modules.transcriptions.support.transcription_nudges import LINE_SOURCE
from core.modules.transcriptions.support.transcription_nudges import TRANSCRIPTION_CHANGED
from engine.event.changed import Changed
from engine.event.deleted import Deleted
from engine.command.context import Context

TITLE_CHARACTERS = 80
UNFINISHED_STATES = (TaskState.OPEN, TaskState.STARTED, TaskState.BLOCKED)


class TranscriptionTaskListener(SaveListener[Changed[Transcription]]):
    """A new transcription, or a user's change to one's text, gives the main agent a line and a task to summarize
    it, linked to the transcription; a task still unfinished serves again."""

    name = "transcriptions.task"

    def __init__(self, queries: Queries, repository: Repository, line: MainAgentLine, scopes: Scopes, links: RowLinkWriter) -> None:
        self.queries, self.repository, self.line, self.scopes = queries, repository, line, scopes
        self.links = links

    def handle(self, event: Changed[Transcription], context: Context) -> None:
        if isinstance(event, Deleted):
            return
        row, old_row = event.row, event.old_row
        has_new_text = old_row is None or (old_row.text != row.text and context.actor.type is ActorType.USER)
        if not has_new_text or not row.text.strip():
            return
        with self.scopes.row_scope(row):
            task_id = self.unfinished_task_id(row) or self.new_task_id(row, context)
            self.line.send_nudge(TRANSCRIPTION_CHANGED.nudge(transcription=row.id, task=task_id), LINE_SOURCE, context)

    def unfinished_task_id(self, row: Transcription) -> int | None:
        linked = self.queries.query(Link).filter(source_model=row.model_name, source_id=row.id, target_model=Task.model_name).all_rows()
        task_ids = [link.target_id for link in linked]
        if not task_ids:
            return None
        unfinished = self.queries.query(Task).matching(Among("id", task_ids)).matching(Among("state", UNFINISHED_STATES)).first()
        return unfinished.id if unfinished is not None else None

    def new_task_id(self, row: Transcription, context: Context) -> int:
        title = f"Summarize transcript {row.id}: {row.title}"[:TITLE_CHARACTERS]
        brief = (f"Read transcription {row.id} with journal transcription show {row.id}, and write what it calls for: a summary, meeting notes, a document, tasks or a plan. "
                 f"Link each row you make to it with journal transcription link {row.id} <model> <number>.")
        task = self.repository.save(Task(creator_id=context.actor.id, title=title, brief=brief, priority=URGENT_PRIORITY), context)
        self.links.save(Link(creator_id=context.actor.id, source_model=row.model_name, source_id=row.id, target_model=Task.model_name, target_id=task.id, link_type=LinkType.SUBJECT), context)
        return task.id
