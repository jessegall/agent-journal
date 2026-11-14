from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import (DISPATCH, FIRST_PROOF, dispatched_worker,
                                                                                repository_environment)
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT, request_merge
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


def outside_job_for_main_agent(story) -> None:
    """Task 3 is assigned to the main agent, so no worker will do it."""
    story.expect_success('task make "Outside job" --brief "Only the main agent does it" --environment main', actor=story.agent)
    story.expect_success(f"task assign 3 --to {agent_number(story, story.agent.id)}", actor=story.agent)


def test_a_send_and_a_dispatch_of_tasks_that_all_wait_on_a_task_assigned_to_the_main_agent_are_refused_naming_it(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success('task make "Waiting job" --brief "Waits on the outside job" --environment main', actor=story.agent)
    outside_job_for_main_agent(story)
    story.expect_success("task depend 2 --on 3", actor=story.agent)
    story.expect_refusal(f"worker send {agent_number(story, worker.id)} --task 2", "every task waits on task 3, which no worker works on", actor=story.agent)
    story.expect_refusal(DISPATCH[:-1] + "2", "every task waits on task 3, which no worker works on", actor=story.agent)


def test_a_worker_left_with_only_tasks_that_wait_on_a_task_assigned_to_the_main_agent_is_named_to_the_main_agent_with_that_task(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    story.expect_success('task make "Waiting job" --brief "Waits on the outside job" --environment main', actor=story.agent)
    worker = Actor(story.new_row_id(DISPATCH + " 2", actor=story.agent), ActorType.AGENT)
    outside_job_for_main_agent(story)
    story.expect_success("task depend 2 --on 3", actor=story.agent)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, "point: 1", actor=worker)
    story.expect_success(COMMIT, actor=worker)
    request_merge(story, worker)
    story.expect_text("worker-worktree show 1", "state: delivered", actor=story.agent)
    story.run_listeners()
    story.expect_success("proof check 1", "state: checked", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    request_merge(story, worker)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    request_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "only task:2, and all wait on task:3, which no worker works on", actor=story.agent)
