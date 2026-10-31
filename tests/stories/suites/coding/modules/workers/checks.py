from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DELIVERY, delivered_worker, repository_environment

SHORTFALL = "the rounding has no test"
PROOF_SHORT = f'proof short 1 "{SHORTFALL}"'


def test_a_proof_the_main_agent_checks_is_checked(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    delivered_worker(story, repository)
    story.expect_success("proof check 1", "state: checked", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: testing")


def test_a_short_proof_moves_the_task_back_to_started_and_tells_the_worker_what_is_missing(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_success(PROOF_SHORT, "state: short", f"shortfall: {SHORTFALL}", actor=story.agent)
    story.expect_success(lines.TASK_DETAILS, "state: started", f"holder_id: {worker.id}")
    story.expect_text(f"message list --agent {worker.id}", SHORTFALL)


def test_a_short_proof_shown_again_and_delivered_is_checked(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = delivered_worker(story, repository)
    story.expect_success(PROOF_SHORT, "state: short", actor=story.agent)
    repository.changed(worker.id, "cart_test.py", "def test_the_total_rounds_to_cents(): pass\n")
    story.expect_success('proof make 1 "cart.py:1, and cart_test.py:1 for the rounding"', "state: shown", actor=worker)
    story.expect_success(DELIVERY, actor=worker)
    story.expect_success(lines.TASK_DETAILS, "state: testing")
    story.expect_success("proof check 1", "state: checked", actor=story.agent)
