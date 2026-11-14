from engine.connection.connection_probe import ConnectionProbe
from engine.connection.internet_connection import InternetConnection
from engine.journal.journal_home import JournalHome
from engine.time.clock import Clock
from engine.actor.actor import Actor
from engine.container.container import Container
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.dispatch_policy import DispatchPolicy
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES
from suites.coding.modules.workers.support.worker_resume import WorkerResume
from suites.coding.modules.workers.support.worker_started_work import WorkerStartedWork

RESUME_REASON = "every worker with a waiting resume line is tried again"


class WorkerResumeRetry:
    """Every few seconds, each worker with a waiting job that the suite's policy says should run is resumed
    again. The launcher refuses a worker while its program is open, and nothing else asks once the program
    has ended. A program still open under an ended row is stopped, on this tick's own thread. A worker that
    has started work with no job waiting is resumed too."""

    def __call__(self, container: Container) -> None:
        InternetConnection.shared(container.get(JournalHome)).check(container.get(ConnectionProbe), container.get(Clock).timestamp())
        queries, resume, policy = container.get(Queries), container.get(WorkerResume), container.get(DispatchPolicy)
        waiting = queries.query(AgentLine).filter(state=AgentLineState.WAITING).matching(Among("source", tuple(RESUMING_SOURCES))).every_row(RESUME_REASON)
        for worker in queries.query(Agent).find_many(list(dict.fromkeys(line.session_agent_id for line in waiting))):
            if policy.is_wanted(worker) and resume.may_resume(worker):
                resume.replace_running_program(worker, Actor.core())
        for worker in container.get(WorkerStartedWork).workers():
            if resume.may_resume(worker):
                resume.replace_running_program(worker, Actor.core())
