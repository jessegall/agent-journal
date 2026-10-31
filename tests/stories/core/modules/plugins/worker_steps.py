from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.modules.plugins.support.worker_step_samples import step_plugin_folder
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DELIVERY, FIRST_PROOF, checked_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


def step_plugin_story(new_story, event_name: str):
    story = new_story(fixture=OrchestratorWithOpenTask)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.run(f"plugin install {step_plugin_folder(story.home.folder.parent, event_name)} --yes", actor=story.user)
    story.repository = repository_environment(story)
    return story


def test_a_plugin_holding_a_workers_delivery_refuses_it_with_its_reason(new_story):
    story = step_plugin_story(new_story, "worker_delivering")
    worker = dispatched_worker(story)
    story.repository.changed(worker.id, "cart.py", "TOTAL = 1\n")
    story.run(FIRST_PROOF, actor=worker)
    story.expect_refusal(DELIVERY, "[plugin steps] cart.py has a sin", actor=worker)
    story.expect_text("worker-worktree list", "cut", actor=story.agent)


def test_a_delivery_the_plugin_lets_through_is_delivered(new_story):
    story = step_plugin_story(new_story, "worker_delivering")
    worker = dispatched_worker(story)
    story.repository.changed(worker.id, "notes.md", "Notes\n")
    story.run(FIRST_PROOF, actor=worker)
    story.expect_success(DELIVERY, actor=worker)


def test_a_plugin_holding_a_merge_refuses_it_with_its_reason(new_story):
    story = step_plugin_story(new_story, "worker_merging")
    worker = checked_worker(story, story.repository)
    story.repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_refusal(f"worker merge {worker.id}", "[plugin steps] cart.py is not judged yet", actor=story.agent)
