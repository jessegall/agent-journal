from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.query.queries import Queries
from suites.coding.modules.workers.models.merger_line import MergerLine
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.report import OrchestratorWithMergerOff
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment

ENDED = "ended with task:1 left"


def stopped_worker(story):
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success(f"agent edit {worker.id} --pid 700 --process-started-at 2026-10-31T09:00:00+00:00", "pid: 700")
    story.expect_success(f"agent stop {worker.id}", actor=user)
    return worker


def test_with_the_merger_on_the_ended_line_of_a_worker_goes_to_the_merger_and_not_to_the_main_agent(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    worker = stopped_worker(story)
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "workers.ended-worker")
    lines = story.container.get(Queries).query(MergerLine).all_rows()
    story.expect_rows(any(f"worker:{worker.id} {ENDED}" in line.text for line in lines))


def test_with_the_merger_off_the_main_agent_hears_the_ended_line_of_a_worker(new_story):
    story = new_story(fixture=OrchestratorWithMergerOff)
    worker = stopped_worker(story)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{worker.id} {ENDED}")
