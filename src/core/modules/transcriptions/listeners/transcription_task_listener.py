from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.transcriptions.models.transcription import Transcription
from core.modules.transcriptions.support.main_agent_line import MainAgentLine
from core.modules.transcriptions.support.transcription_nudges import TRANSCRIPTION_CHANGED

TITLE_CHARACTERS = 80
UNFINISHED_STATES = (TaskState.OPEN, TaskState.STARTED, TaskState.BLOCKED)


class TranscriptionTaskListener(SaveListener):
    """A new transcription, or a person's change to one's text, gives the main agent a line and a task to summarize
    it, linked to the transcription; a task still unfinished serves again."""

    name = "transcriptions.task"
    event = "transcription.*"

    def __init__(self, queries: Queries, repository: Repository, line: MainAgentLine) -> None:
        self.queries, self.repository, self.line = queries, repository, line

    def handle(self, change: Change[Model]) -> None:
        row, old_row = change.new_row, change.old_row
        if not isinstance(row, Transcription):
            return
        has_new_text = old_row is None or (isinstance(old_row, Transcription) and old_row.text != row.text and change.context.actor.type is ActorType.USER)
        if not has_new_text or not row.text.strip():
            return
        task_id = self.unfinished_task_id(row) or self.new_task_id(row, change)
        self.line.send(row.environment_id, TRANSCRIPTION_CHANGED.nudge(transcription=row.id, task=task_id).text, change.context)

    def unfinished_task_id(self, row: Transcription) -> int | None:
        linked = self.queries.query(Link).filter(source_model=row.model_name, source_id=row.id, target_model=Task.model_name).all_rows()
        task_ids = [link.target_id for link in linked]
        if not task_ids:
            return None
        unfinished = self.queries.query(Task).matching(Among("id", task_ids)).matching(Among("state", UNFINISHED_STATES)).page(1, 1).rows
        return unfinished[0].id if unfinished else None

    def new_task_id(self, row: Transcription, change: Change[Model]) -> int:
        title = f"Summarize transcript {row.id}: {row.title}"[:TITLE_CHARACTERS]
        brief = (f"Read transcription {row.id} with journal transcription show {row.id}, and write what it calls for: a summary, meeting notes, a document, tasks or a plan. "
                 f"Link each row you make to it with journal transcription link {row.id} <model> <number>.")
        task = self.repository.save(Task(environment_id=row.environment_id, creator_id=change.context.actor.id, title=title, brief=brief), change.context)
        self.repository.save(Link(creator_id=change.context.actor.id, source_model=row.model_name, source_id=row.id, target_model=Task.model_name, target_id=task.id, link_type=LinkType.SUBJECT), change.context)
        return task.id
