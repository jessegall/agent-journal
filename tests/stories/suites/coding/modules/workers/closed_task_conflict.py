from tests.stories.suites.coding.modules.workers.support.commit_command import request_merge
from tests.stories.core.support.agent_labels import agent_number
import pytest

from engine.actor.actor import Actor
from engine.testing.stories.story import Story

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import FIRST_PROOF, checked_worker, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH, GitRepository


@pytest.mark.parametrize("command,notice,proof_goes_short", [("worker merge --wait {worker}", "clashed on cart.py", True),
                                                             ('worker send --wait {worker} "Finish the total"', "takes the job", False)])
@pytest.mark.real_git
def test_a_conflict_reopens_the_closed_task_before_asking_the_worker_to_edit(new_story, command, notice, proof_goes_short):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    story.expect_text("task show 1", "state: completed", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("cart.py", "TOTAL = 2\n", "Another total")
    story.expect_text(command.format(worker=agent_number(story, worker.agent_id())), notice, actor=story.agent)
    story.expect_text(f"agent-line list --agent {worker.id}", "clashes on cart.py")
    story.expect_text("task show 1", "state: started", f"holder_id: {worker.id}")
    path = repository.worktree_folder(worker.id) / "cart.py"
    story.expect_hook_allowed(worker_session(story, worker), HookSamples.edit(str(path)))
    path.write_text("TOTAL = 3\n")
    if proof_goes_short:
        story.expect_success(FIRST_PROOF, "point: 1", actor=worker)
    story.expect_success("worker commit --wait --differences none", actor=worker)
    if proof_goes_short:
        story.expect_success("proof check 1", "state: checked", actor=story.agent)
    story.expect_success(f"worker logs {agent_number(story, worker.agent_id())}", actor=story.agent)
    request_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.agent_id())}", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", "TOTAL = 3\n")





@pytest.fixture
def checked_story(new_story) -> tuple[Story, GitRepository, Actor]:
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    return story, repository, checked_worker(story, repository)


@pytest.mark.real_git
def test_a_task_that_comes_back_from_a_clash_has_its_proof_short_and_is_proved_and_committed_again(checked_story):
    story, repository, worker = checked_story
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed("cart.py", "TOTAL = 2\n", "Another total")
    story.expect_text(f"worker merge --wait {agent_number(story, worker.agent_id())}", "clashed on cart.py", actor=story.agent)
    story.expect_text("proof show 1", "state: short", "settle them and prove it again", actor=story.agent)
    repository.changed(worker.id, "cart.py", "TOTAL = 3\n")
    story.expect_success(FIRST_PROOF, "point: 1", actor=worker)
    story.expect_success("worker commit --wait --differences none", actor=worker)
    story.expect_success("proof check 1", "state: checked", actor=story.agent)
    story.expect_success(f"worker logs {agent_number(story, worker.agent_id())}", actor=story.agent)
    request_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.agent_id())}", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", "TOTAL = 3\n")
