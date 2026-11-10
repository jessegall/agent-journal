from core.modules.agents.models.agent import Agent
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.query.queries import Queries
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, checked_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

KEPT_LIMIT = "setting set journal.suites.coding.workers.worker-kept-limit 1 --environment main"


def test_a_dispatch_at_the_kept_limit_is_refused_naming_the_idle_worker_to_send_to_and_the_person_who_retires(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_success(KEPT_LIMIT)
    task_id = story.new_row_id('task make "Add the tax" --brief "Add the tax to the cart total"', actor=story.agent)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    outcome = story.run(DISPATCH.removesuffix(" 1") + f" {task_id}", actor=story.agent)
    launcher.server.close()
    story.home.socket("launcher").unlink()
    workers = list(story.container.get(Queries).query(Agent).filter(role="worker").all_rows())
    story.expect_rows(outcome.code == 1, "send the job to idle worker" in outcome.output_text, f"worker {agent_number(story, worker.id)}" in outcome.output_text,
                      "ask the person to retire" in outcome.output_text, "journal agent retire" not in outcome.output_text, len(workers) == 1, detail=outcome.output_text)
