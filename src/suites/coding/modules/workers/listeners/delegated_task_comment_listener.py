from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.support.row_link_writer import RowLinkWriter
from engine.driver.nudger import Nudger
from core.modules.messages.models.message import Message
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_TASK_COMMENT, WORKER_COMMENT_COPY
from engine.event.created import Created
from engine.command.context import Context

SOURCE = "workers.delegated-task-comment"


class DelegatedTaskCommentListener(SaveListener[Created[Link]]):
    """A person's comment on a task delegated to a worker goes to the worker as a job, and the comment is
    linked to that worker so the chat shows where it went; the main agent, which reads the comment as a
    message, is told the worker has it too, so it decides who acts on it."""

    name = "workers.delegated-task-comment"
    disabled_scopes = [ActorScope]

    def __init__(self, links: RowLinkWriter, queries: Queries, nudger: Nudger, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.links, self.queries, self.nudger = links, queries, nudger

    def handle(self, event: Created[Link], context: Context) -> None:
        link = event.row
        if link.link_type != LinkType.COMMENT or link.target_model != Task.model_name:
            return
        worker_id = self.queries.query(Task).find(link.target_id).delegated_to
        if worker_id is None or self.queries.query(ActorRecord).find(context.actor.id).type is not ActorType.USER:
            return
        if self.queries.query(Agent).find(worker_id).role == AgentRole.MAIN:
            return
        message = self.queries.query(Message).find(link.source_id)
        self.nudger.send(worker_id, WORKER_TASK_COMMENT, WORKER_JOB_SOURCE, context, task=link.target_id)
        self.links.save(Link(creator_id=context.actor.id, source_model=Message.model_name, source_id=message.id, target_model=Agent.model_name, target_id=worker_id, link_type=LinkType.RECIPIENT), context)
        parent_id = self.queries.query(Agent).find(worker_id).parent_id
        if parent_id is not None:
            self.nudger.send(parent_id, WORKER_COMMENT_COPY, SOURCE, context, worker=self.numbers.number(AGENT_MODEL_NAME, worker_id), message=message.id)
