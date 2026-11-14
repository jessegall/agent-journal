from core.modules.agents.models.agent import Agent
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.agents.support.dispatch_policy import DispatchPolicy
from engine.journal.journal_home import LAUNCHER_SOCKET
from engine.scope.scopes import Scopes
from suites.coding.modules.workers.support.worker_policy import WorkerPolicy
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.gone_workers import missing_program, running_worker, worker_story

__all__ = ["missing_program", "running_worker", "worker_story"]

JOB = 'worker send --wait {number} "Add the tax"'


def answers_after_an_end(story, ending_actor) -> dict[str, bool]:
    """What the suite's policy answers about a worker that was sent a job while it ran and was then ended by the
    given actor, with no launcher to start it again; the reconcile tick of task 8482 will act on these answers,
    and until it exists the stories read them."""
    story.home.socket(LAUNCHER_SOCKET).unlink(missing_ok=True)
    story.run(JOB.format(number=agent_number(story, story.worker.id)), actor=story.agent)
    story.expect_success(f"agent end {story.worker.id}", actor=ending_actor)
    policy, worker = story.container.get(DispatchPolicy), story.row(Agent, story.worker.id)
    with story.container.get(Scopes).read_scope((), None, 1):
        return {"suite policy": isinstance(policy, WorkerPolicy), "wanted": policy.is_wanted(worker), "final": policy.is_final(worker), "messages": policy.takes_messages(worker)}


def test_556_a_worker_a_person_stopped_with_a_job_waiting_is_gone_for_good_and_not_wanted_back(running_worker):
    person = Actor(running_worker.new_row_id('actor make user "Ada"'), ActorType.USER)
    answers = answers_after_an_end(running_worker, person)
    running_worker.expect_rows(answers == {"suite policy": True, "wanted": False, "final": True, "messages": True}, detail=str(answers))


def test_556_a_worker_that_ended_by_itself_with_a_job_waiting_is_wanted_back_and_not_gone_for_good(running_worker):
    answers = answers_after_an_end(running_worker, running_worker.worker)
    running_worker.expect_rows(answers == {"suite policy": True, "wanted": True, "final": False, "messages": True}, detail=str(answers))
