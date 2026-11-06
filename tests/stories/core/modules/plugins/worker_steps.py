from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.modules.plugins.support.worker_step_samples import step_plugin_folder
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DELIVERY, DISPATCH, FIRST_PROOF, checked_worker, dispatched_worker, repository_environment
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


def test_a_plugin_holding_a_workers_delivery_also_refuses_its_move_to_the_next_task(new_story):
    story = step_plugin_story(new_story, "worker_delivering")
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, f"{DISPATCH} 2")
    story.repository.changed(worker.id, "cart.py", "TOTAL = 1\n")
    story.run(FIRST_PROOF, actor=worker)
    story.expect_refusal("worker next", "[plugin steps] cart.py has a sin", actor=worker)
    story.expect_text("task show 1", "state: started", actor=story.agent)


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


def delivered_with_file(new_story, name: str):
    story = step_plugin_story(new_story, "worker_delivering")
    worker = dispatched_worker(story)
    story.repository.changed(worker.id, name, "TOTAL = 1\n")
    story.run(FIRST_PROOF, actor=worker)
    story.expect_success(DELIVERY, actor=worker)
    return story, worker


def test_what_a_plugin_tells_at_a_delivery_reaches_the_worker_and_its_main_agent(new_story):
    story, worker = delivered_with_file(new_story, "told.py")
    story.expect_text(f"agent-line list --agent {worker.id}", "[plugin steps] the judging did not finish", actor=worker)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "[plugin steps] the judging did not finish", actor=story.agent)


def test_a_plugin_that_fails_at_a_delivery_is_on_record_and_says_the_step_was_not_judged(new_story):
    story, worker = delivered_with_file(new_story, "broken.py")
    story.expect_text("plugin list --json", "at worker_delivering", actor=story.agent)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "[plugin steps] could not judge this step", actor=story.agent)

