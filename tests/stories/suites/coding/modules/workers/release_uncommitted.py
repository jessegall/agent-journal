from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE
from tests.stories.suites.coding.modules.workers.support.phase_steps import single_task_worker


def test_a_release_is_refused_while_the_worker_has_uncommitted_files_and_goes_through_with_abandon(new_story, monkeypatch):
    worker = single_task_worker(new_story, monkeypatch)
    story = worker.story
    worker.repository.changed(worker.worker.id, "cart.py", CART_CHANGE)
    number = agent_number(story, worker.worker.id)
    story.expect_refusal(f'worker release {number} "wrong job"', "has uncommitted files", actor=story.agent)
    story.expect_success(f'worker release {number} --abandon "wrong job"', actor=story.agent)
