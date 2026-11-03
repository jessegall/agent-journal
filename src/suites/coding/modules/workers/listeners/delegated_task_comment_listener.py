from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.drivers.support.nudger import Nudger
from core.modules.messages.models.message import Message
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK_COMMENT, WORKER_COMMENT_COPY

SOURCE = "workers.delegated-task-comment"


class DelegatedTaskCommentListener(SaveListener):
    """A person's comment on a task delegated to a worker goes to the worker as a job, and the comment is
    linked to that worker so the chat shows where it went; the main agent, which reads the comment as a
    message, is told the worker has it too, so it decides who acts on it."""

    name = "workers.delegated-task-comment"
    event = "link.create"

    def __init__(self, repository: Repository, queries: Queries, nudger: Nudger) -> None:
        self.repository, self.queries, self.nudger = repository, queries, nudger

    def handle(self, change: Change[Model]) -> None:
        link = change.new_row
        if not isinstance(link, Link) or link.link_type != LinkType.COMMENT or link.target_model != Task.model_name:
            return
        worker_id = self.queries.query(Task).find(link.target_id).delegated_to
        if worker_id is None or self.queries.query(ActorRecord).find(change.actor.id).type is not ActorType.USER:
            return
        message = self.queries.query(Message).find(link.source_id)
        self.nudger.send(worker_id, WORKER_TASK_COMMENT, WORKER_JOB_SOURCE, change.context, task=link.target_id)
        self.repository.save(Link(creator_id=change.actor.id, source_model=Message.model_name, source_id=message.id, target_model=Agent.model_name, target_id=worker_id, link_type=LinkType.RECIPIENT), change.context)
        parent_id = self.queries.query(Agent).find(worker_id).parent_id
        if parent_id is not None:
            self.nudger.send(parent_id, WORKER_COMMENT_COPY, SOURCE, change.context, worker=worker_id, message=message.id)
