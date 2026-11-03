import json
import pytest

from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.messages.models.message import Message
from core.modules.tasks.queries.task_query import TaskQuery
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.chat.support.mark_samples import marks_text
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import delivered_worker, dispatched_worker
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask, SubagentStarted
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH


def delegated_story(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1 2", actor=story.agent), ActorType.AGENT)
    return story, repository, worker


def last_message_id(story) -> int:
    return story.container.get(Queries).query(Message).newest().page(1, 1).rows[0].id


def test_a_workers_moves_show_as_marks_in_the_chat(new_story):
    story, repository, worker = delegated_story(new_story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.run('proof make 1 "cart.py:1, the cart total story"', actor=worker)
    story.run("worker next", actor=worker)
    story.run_listeners()
    assert f"Worker {worker.id} started task 1" in marks_text(story) and f"Worker {worker.id} started task 2" in marks_text(story), marks_text(story)


def judge_sample(*arguments: str):
    return HookSamples.shell(f"journal sins {' '.join(arguments)}", ShellPart("journal", CommandCategory.JOURNAL, ["sins", *arguments], subcommand="sins"))


@pytest.fixture
def judge_worker(new_story):
    return delegated_story(new_story)


def test_a_judge_named_inside_a_workers_quoted_text_is_no_judge_run(judge_worker):
    story, _, worker = judge_worker
    line = HookSamples.shell('journal task log 1 "I will run journal sins next"', ShellPart("journal", CommandCategory.JOURNAL, ["task", "log", "1", "I will run journal sins next"], subcommand="task"))
    assert "a worker judges only its own changes" not in story.hook(worker_session(story, worker), line).refusal


def test_a_worker_judges_only_its_changes_and_the_main_agent_judges_all(judge_worker):
    story, _, worker = judge_worker
    session = worker_session(story, worker)
    story.expect_hook_refusal(session, judge_sample("src"), "a worker judges only its own changes")
    story.expect_hook_refusal(session, judge_sample(), "a worker judges only its own changes")
    story.expect_hook_allowed(session, judge_sample("--changes"))
    story.expect_hook_allowed(session, judge_sample("--branch"))
    story.expect_hook_allowed("s-1", judge_sample("src"))


def test_a_dispatch_shows_a_mark_naming_the_worker_its_model_and_its_queue(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    story.run('worker dispatch 1 2 --model sonnet --name "Noah Webster"', actor=story.agent)
    story.run_listeners()
    assert "Noah Webster started task 1" in marks_text(story), marks_text(story)
    story.expect_text("chat-mark list --json", "sonnet", "Queued: task 2", actor=story.agent)


def test_a_persons_comment_on_a_delegated_task_reaches_the_worker_and_the_main_agent(new_story):
    story, _, worker = delegated_story(new_story)
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success('task comment 1 "use the new cart" --environment main', actor=user)
    story.expect_text(f"agent-line list --agent {worker.id}", "the user commented on task:1: journal task comments 1")
    story.expect_text("task comments 1", "use the new cart", actor=worker)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{worker.id} was also told message:")
    story.expect_text("message unread --environment main", "use the new cart", actor=story.agent)


def test_a_persons_comment_on_a_delegated_task_is_linked_to_the_worker_it_was_also_sent_to(new_story):
    story, _, worker = delegated_story(new_story)
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success('task comment 1 "use the new cart" --environment main', actor=user)
    message_id = last_message_id(story)
    story.expect_text(f"link list --source message:{message_id}", f"message:{message_id}  sent_to  agent:{worker.id}")


def test_a_queued_task_moves_to_the_main_agent_or_another_worker(new_story):
    story, _, worker = delegated_story(new_story)
    story.expect_text(f"task assign 2 --to {story.agent.id}", f"task:2", actor=story.agent)
    story.expect_absent("task show 2", "delegated_to", actor=story.agent)
    story.expect_text(f"task assign 2 --to {worker.id}", "task:2", actor=story.agent)
    story.expect_text("task show 2", f"delegated_to: {worker.id}", "state: open", actor=story.agent)


def test_a_task_a_worker_releases_leaves_its_queue_and_it_goes_on_with_its_next(new_story):
    story, _, worker = delegated_story(new_story)
    story.expect_success('task release 1 --reason "it needs a fixture I cannot make"', actor=worker)
    story.expect_text("task show 1", "state: open", actor=story.agent)
    story.expect_absent("task show 1", "delegated_to", actor=story.agent)
    story.expect_text("task show 2", "state: started", f"holder_id: {worker.id}", actor=story.agent)
    story.expect_text("worker-worktree show 1", "task_id: 2", actor=story.agent)
    story.expect_absent(f"agent-line list --agent {worker.id}", "was taken from you")


def test_a_started_task_taken_from_a_worker_goes_back_open_and_the_worker_goes_on_with_its_next(new_story):
    story, _, worker = delegated_story(new_story)
    story.expect_text(f"task assign 1 --to {story.agent.id}", "task:1", actor=story.agent)
    story.expect_text("task show 1", "state: open", "reason: assigned to agent", actor=story.agent)
    story.expect_absent("task show 1", "delegated_to", actor=story.agent)
    story.expect_text("task show 2", "state: started", f"holder_id: {worker.id}", actor=story.agent)
    story.expect_text("worker-worktree show 1", "task_id: 2", actor=story.agent)
    story.expect_text(f"agent-line list --agent {worker.id}", "task:1 was taken from you: leave it", "your next task is task:2: journal task show 2")


def test_a_task_is_not_assigned_to_a_subagent_and_the_refusal_names_who_takes_one(new_story):
    story = new_story(fixture=SubagentStarted)
    story.expect_success('task make "Fix the cart" --environment main')
    story.expect_refusal(f"task assign 1 --to {story.subagent.id}", "is a subagent and takes no task", actor=story.agent)
    story.expect_refusal(f"task assign 1 --to {story.subagent.id}", "the main agent and a worker with a cut worktree take a task", actor=story.agent)
    story.expect_absent("task show 1", "delegated_to", actor=story.agent)


def test_a_task_is_not_assigned_to_a_worker_whose_work_is_delivered(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = delivered_worker(story, repository)
    story.expect_refusal(f"task assign 2 --to {worker.id}", "is a worker and takes no task", actor=story.agent)
    story.expect_refusal(f"task assign 2 --to {worker.id}", "a worker with a cut worktree take a task", actor=story.agent)
    story.expect_absent("task show 2", "delegated_to", actor=story.agent)


def test_a_workers_last_task_goes_back_with_the_worker(new_story):
    story, _, worker = delegated_story(new_story)
    story.expect_success(f"task assign 2 --to {story.agent.id}", actor=story.agent)
    story.expect_refusal(f"task assign 1 --to {story.agent.id}", f"task 1 is the last of worker {worker.id}", actor=story.agent)


def test_a_task_is_not_assigned_to_who_holds_it_or_when_it_has_ended(new_story):
    story, _, worker = delegated_story(new_story)
    story.expect_refusal(f"task assign 1 --to {worker.id}", "nothing to move", actor=story.agent)
    story.run('task cancel 2 --reason "no"', actor=story.agent)
    story.expect_refusal(f"task assign 2 --to {story.agent.id}", "only an open or started task moves", actor=story.agent)


def test_a_comment_on_a_task_with_no_worker_tells_no_worker_and_links_none(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success('task comment 1 "use the new cart" --environment main', actor=user)
    assert "was also told" not in story.run(f"agent-line list --agent {story.agent.id}").output_text
    assert "sent_to" not in story.run(f"link list --source message:{last_message_id(story)}").output_text


def test_a_worker_delivers_nothing_while_a_task_is_queued(new_story):
    story, repository, worker = delegated_story(new_story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 "cart.py:1, the cart total story"', actor=worker)
    story.expect_refusal("worker deliver", "task 2 is still in your queue", actor=worker)
    story.expect_text("task show 1", "state: started", actor=story.agent)


def test_moving_to_the_next_task_hands_nothing_in_and_the_last_task_has_no_next(new_story):
    story, repository, worker = delegated_story(new_story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 "cart.py:1, the cart total story"', actor=worker)
    story.expect_success("worker next", actor=worker)
    story.run_listeners()
    assert "handed in" not in marks_text(story), marks_text(story)
    story.expect_refusal("worker next", "task 2 is your last", actor=worker)


def dispatch_sample(*arguments: str):
    return HookSamples.shell("journal worker dispatch", ShellPart("journal", "journal", ["worker", "dispatch", *arguments]))


def ended_worker_story(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.run(f"agent end {worker.id}")
    story.run('task make "Tax" --brief "Add the tax in cart.py" --environment main', actor=story.agent)
    story.run('task make "Till" --brief "Print the till in till.py" --environment main', actor=story.agent)
    return story, worker


def test_a_dispatch_on_a_file_an_ended_worker_changed_is_refused_naming_it(new_story):
    story, worker = ended_worker_story(new_story)
    story.expect_hook_refusal("s-1", dispatch_sample("2", "--model", "sonnet"), f"journal worker send {worker.id}")


def test_fresh_passes_and_a_dispatch_on_other_files_goes_out(new_story):
    story, _ = ended_worker_story(new_story)
    story.expect_hook_allowed("s-1", dispatch_sample("2", "--model", "sonnet", "--fresh"))
    story.expect_hook_allowed("s-1", dispatch_sample("3", "--model", "sonnet"))


def test_several_tasks_go_to_one_worker_and_only_the_first_starts(new_story):
    story, _, worker = delegated_story(new_story)
    story.expect_text("task show 1", "state: started", f"delegated_to: {worker.id}", actor=story.agent)
    story.expect_text("task show 2", "state: open", f"delegated_to: {worker.id}", actor=story.agent)


def test_delivering_starts_the_next_delegated_task_in_the_same_worktree(new_story):
    story, repository, worker = delegated_story(new_story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 "cart.py:1, the cart total story"', actor=worker)
    story.expect_text("worker next", "your next task, task 2: Second job", "Do the second job", actor=worker)
    story.expect_text("task show 1", "state: testing", actor=story.agent)
    story.expect_text("task show 2", "state: started", f"holder_id: {worker.id}", actor=story.agent)
    story.expect_text("worker-worktree show 1", "state: cut", "task_id: 2", actor=story.agent)


def test_the_last_delivery_delivers_the_worktree_and_the_merge_closes_every_task(new_story):
    story, repository, worker = delegated_story(new_story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 "cart.py:1, the cart total story"', actor=worker)
    story.run("worker next", actor=worker)
    repository.changed(worker.id, "cart.py", "TOTAL = 3\n")
    story.expect_success('proof make 1 "cart.py:1, the second story"', actor=worker)
    story.run("worker deliver", actor=worker)
    story.expect_text("worker-worktree show 1", "state: delivered", actor=story.agent)
    story.expect_text("task show 1", "state: testing", actor=story.agent)
    story.expect_text("task show 2", "state: testing", actor=story.agent)
    story.run_listeners()
    assert "handed in task 1, task 2" in marks_text(story), marks_text(story)
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
