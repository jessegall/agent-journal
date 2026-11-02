import json

from core.base.query.conditions.is_null import IsNull
from core.modules.tasks.queries.task_query import TaskQuery
from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.modules.chat.support.mark_samples import marks_text
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


def delegated_story(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1 2", actor=story.agent), ActorType.AGENT)
    return story, repository, worker


def test_a_workers_moves_show_as_marks_in_the_chat(new_story):
    story, repository, worker = delegated_story(new_story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.run('proof make 1 "cart.py:1, the cart total story"', actor=worker)
    story.run("worker deliver", actor=worker)
    story.run_listeners()
    assert f"Worker {worker.id} started task 1" in marks_text(story) and f"Worker {worker.id} started task 2" in marks_text(story), marks_text(story)


def test_several_tasks_go_to_one_worker_and_only_the_first_starts(new_story):
    story, _, worker = delegated_story(new_story)
    story.expect_text("task show 1", "state: started", f"delegated_to: {worker.id}", actor=story.agent)
    story.expect_text("task show 2", "state: open", f"delegated_to: {worker.id}", actor=story.agent)


def test_delivering_starts_the_next_delegated_task_in_the_same_worktree(new_story):
    story, repository, worker = delegated_story(new_story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 "cart.py:1, the cart total story"', actor=worker)
    story.expect_text("worker deliver", "your next task, task 2: Second job", "Do the second job", actor=worker)
    story.expect_text("task show 1", "state: testing", actor=story.agent)
    story.expect_text("task show 2", "state: started", f"holder_id: {worker.id}", actor=story.agent)
    story.expect_text("worker-worktree show 1", "state: cut", "task_id: 2", actor=story.agent)


def test_the_last_delivery_delivers_the_worktree_and_the_merge_closes_every_task(new_story):
    story, repository, worker = delegated_story(new_story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 "cart.py:1, the cart total story"', actor=worker)
    story.run("worker deliver", actor=worker)
    repository.changed(worker.id, "cart.py", "TOTAL = 3\n")
    story.expect_success('proof make 1 "cart.py:1, the second story"', actor=worker)
    story.run("worker deliver", actor=worker)
    story.expect_text("worker-worktree show 1", "state: delivered", actor=story.agent)
    story.run("proof check 1", actor=story.agent)
    story.run("proof check 2", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    story.expect_text("task show 1", "state: completed", actor=story.agent)
    story.expect_text("task show 2", "state: completed", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", "TOTAL = 3\n")


def test_releasing_a_worker_gives_its_delegated_tasks_back(new_story):
    story, _, worker = delegated_story(new_story)
    story.expect_success(f'worker release {worker.id} "not needed"', actor=story.agent)
    story.expect_text("task show 1", "state: open", actor=story.agent)
    assert "delegated_to" not in story.run("task show 2", actor=story.agent).output_text or "delegated_to: None" in story.run("task show 2", actor=story.agent).output_text


def test_the_assigner_leaves_a_delegated_task_alone(new_story):
    story, _, _ = delegated_story(new_story)
    tasks = story.container.get(TaskQuery)
    assert tasks.next_open(1, None, IsNull("closed_at")) is None


def test_the_board_lists_tasks_delegated_to_a_worker_in_a_group_of_their_own_apart_from_the_states(new_story):
    story, _, worker = delegated_story(new_story)
    story.run('task make "My own job" --environment main', actor=story.agent)
    groups = {group["state"]: group for group in json.loads(story.run("task board --environment main --json", actor=story.user).output_text)["groups"]}
    assert [row["id"] for row in groups["delegated"]["rows"]] == [2, 1] and groups["delegated"]["total"] == 2
    assert {row["delegated_to"] for row in groups["delegated"]["rows"]} == {worker.id}
    assert groups["started"]["total"] == 0 and [row["id"] for row in groups["open"]["rows"]] == [3]
    page = json.loads(story.run("task board --environment main --state delegated --before-id 2 --json", actor=story.user).output_text)["groups"][0]
    assert [row["id"] for row in page["rows"]] == [1]


def test_a_dispatch_with_no_model_is_refused(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.expect_refusal("worker dispatch 1", "add --model", actor=story.agent)


def test_a_workers_facts_carry_its_model_profile_and_name_with_no_status_file(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = story.new_row_id("worker dispatch --model sonnet --profile journal-medior --name Lovelace 1", actor=story.agent)
    story.expect_text("usage agents --environment main --json", f'"id": {worker}', '"model": "sonnet"', '"profile": "journal-medior"', '"given_name": "Lovelace"', actor=story.agent)
