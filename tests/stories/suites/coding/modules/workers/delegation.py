from tests.stories.core.support.agent_labels import agent_number
from core.modules.agents.models.agent import Agent
import json
import pytest

from core.modules.plans.support.next_plan_tasks import NextPlanTasks
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.support.worker_next_task import WorkerNextTask
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.messages.models.message import Message
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.chat.support.mark_samples import expect_absent_marks_text, expect_marks_text
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import delivered_worker, dispatched_worker
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator, BuilderHelper
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, repository_environment, worker_session
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from engine.testing.expectations.expect_reply import expect_absent_reply_refusal
from tests.stories.support.story_checks import expect_value


def delegated_story(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2", actor=story.agent), ActorType.AGENT)
    return story, repository, worker


def last_message_id(story) -> int:
    return story.container.get(Queries).query(Message).newest().page(1, 1).rows[0].id


@pytest.fixture
def judge_worker(new_story):
    return delegated_story(new_story)


def test_a_judge_named_inside_a_workers_quoted_text_is_no_judge_run(judge_worker):
    story, _, worker = judge_worker
    line = HookSamples.shell('journal task log 1 "I will run journal sins next"', ShellPart("journal", CommandCategory.JOURNAL, ["task", "log", "1", "I will run journal sins next"], subcommand="task"))
    expect_absent_reply_refusal(story.hook(worker_session(story, worker), line), "a worker judges only its own changes")


def test_the_chat_marks_can_be_read_by_type_for_the_recent_activity_of_the_workers(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.run('worker dispatch --test-command python=pytest 1 --model sonnet --name "Noah Webster"', actor=story.agent)
    story.run_listeners()
    story.expect_text("chat-mark main --environment main --type workers.worker", "Noah Webster started task 1", actor=story.agent)
    story.run("chat-mark main --environment main --type workers.tests", actor=story.agent).expect_no_text("Noah Webster started task 1")


def test_a_dispatch_shows_a_mark_naming_the_worker_its_model_and_its_queue(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    story.run('worker dispatch --test-command python=pytest 1 2 --model sonnet --name "Noah Webster"', actor=story.agent)
    story.run_listeners()
    expect_marks_text(story, "Noah Webster started task 1")
    story.expect_text("chat-mark list --json", "sonnet", "Queued: task 2", actor=story.agent)


def test_a_persons_comment_on_a_delegated_task_reaches_the_worker_and_the_main_agent_and_is_linked_to_the_worker(new_story):
    story, _, worker = delegated_story(new_story)
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success('task comment 1 "use the new cart" --environment main', actor=user)
    story.expect_text(f"agent-line list --agent {worker.id}", "the user commented on task:1")
    story.expect_text("task comments 1", "use the new cart", actor=worker)
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"worker:{worker.id} was also told message:")
    story.expect_text("message unread --environment main", "use the new cart", actor=story.agent)
    message_id = last_message_id(story)
    story.expect_text(f"link list --source message:{message_id}", f"message:{message_id}  sent_to  agent:{worker.id}")


def test_a_worker_gets_none_of_the_messages_the_person_wrote_to_the_main_agent(new_story):
    story, _, worker = delegated_story(new_story)
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success('message send "Fix the cart first" --environment main', actor=user)
    story.expect_absent("message unread --environment main", "Fix the cart first", actor=worker)
    story.expect_text("message unread --environment main", "Fix the cart first", actor=story.agent)


def test_a_started_task_taken_from_a_worker_goes_back_open_and_the_worker_goes_on_with_its_next(new_story):
    story, _, worker = delegated_story(new_story)
    story.expect_text(f"task assign 1 --to {agent_number(story, story.agent.id)}", "task:1", actor=story.agent)
    story.expect_text("task show 1", "state: open", "reason: assigned to agent", f"delegated_to: {story.agent.id}", actor=story.agent)
    story.expect_text("task show 2", "state: started", f"holder_id: {worker.id}", actor=story.agent)
    story.expect_text("worker-worktree show 1", "task_id: 2", actor=story.agent)
    story.expect_text(f"agent-line list --agent {worker.id}", "task:1 was taken from you: leave it", "your next task is task:2")


def test_a_task_is_not_assigned_to_a_helper_and_the_refusal_names_who_takes_one(new_story):
    story = new_story(fixture=BuilderHelper)
    story.expect_success('task make "Fix the cart" --environment main')
    story.expect_refusal(f"task assign 1 --to {agent_number(story, story.helper.id)}", "is a helper and takes no task", actor=story.agent)
    story.expect_refusal(f"task assign 1 --to {agent_number(story, story.helper.id)}", "the main agent and a worker with a cut worktree take a task", actor=story.agent)
    story.expect_absent("task show 1", "delegated_to", actor=story.agent)


def test_a_task_is_not_assigned_to_a_worker_whose_work_is_delivered(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    story.run('task make "Second job" --brief "Do the second job" --environment main', actor=story.agent)
    worker = delivered_worker(story, repository)
    story.expect_refusal(f"task assign 2 --to {agent_number(story, worker.id)}", "is a worker and takes no task", actor=story.agent)
    story.expect_refusal(f"task assign 2 --to {agent_number(story, worker.id)}", "a worker with a cut worktree take a task", actor=story.agent)
    story.expect_absent("task show 2", "delegated_to", actor=story.agent)


def test_a_workers_last_task_can_be_taken_back_after_other_work_is_finished(new_story):
    story, repository, worker = delegated_story(new_story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart total story"', actor=worker)
    story.expect_success("worker next --wait --differences none", actor=worker)
    story.expect_success(f"task assign 2 --to {agent_number(story, story.agent.id)}", actor=story.agent)
    story.expect_text("task show 2", "state: open", actor=story.agent)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_text("worker-worktree show 1", "state: delivered", actor=story.agent)
    story.expect_text("task show 1", "state: testing", actor=story.agent)


@pytest.fixture
def delegated(new_story):
    return delegated_story(new_story)



def test_a_task_is_not_assigned_to_who_holds_it_or_when_it_has_ended(delegated):
    story, _, worker = delegated
    story.expect_refusal(f"task assign 1 --to {agent_number(story, worker.id)}", "nothing to move", actor=story.agent)
    story.run('task cancel 2 --reason "no"', actor=story.agent)
    story.expect_refusal(f"task assign 2 --to {agent_number(story, story.agent.id)}", "only an open, blocked or started task moves", actor=story.agent)


def test_a_comment_on_a_task_with_no_worker_tells_no_worker_and_links_none(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success('task comment 1 "use the new cart" --environment main', actor=user)
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", "was also told")
    story.expect_no_text(f"link list --source message:{last_message_id(story)}", "sent_to")


def test_a_worker_delivers_nothing_while_a_task_is_queued(new_story):
    story, repository, worker = delegated_story(new_story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart total story"', actor=worker)
    story.expect_refusal("worker deliver --wait --differences none", "task 2 is still in your queue", actor=worker)
    story.expect_text("task show 1", "state: started", actor=story.agent)


def test_moving_to_the_next_task_hands_nothing_in_and_the_last_task_has_no_next(new_story):
    story, repository, worker = delegated_story(new_story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart total story"', actor=worker)
    story.expect_success("worker next --wait --differences none", actor=worker)
    story.run_listeners()
    expect_absent_marks_text(story, "handed in")
    story.expect_refusal("worker next --wait --differences none", "task 2 is your last", actor=worker)


def dispatch_sample(*arguments: str):
    return HookSamples.shell("journal worker dispatch", ShellPart("journal", "journal", ["worker", "dispatch", *arguments]))


def ended_worker_story(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.run(f"agent end {worker.id}")
    story.run('task make "Tax" --brief "Add the tax in cart.py" --environment main', actor=story.agent)
    story.run('task make "Till" --brief "Print the till in till.py" --environment main', actor=story.agent)
    return story, worker


def test_a_dispatch_on_a_file_an_ended_worker_changed_is_refused_naming_it(new_story):
    story, worker = ended_worker_story(new_story)
    story.expect_hook_refusal("s-1", dispatch_sample("2", "--model", "sonnet"), f"worker:{worker.id} changed these files")


def test_several_tasks_go_to_one_worker_and_only_the_first_starts(new_story):
    story, _, worker = delegated_story(new_story)
    story.expect_text("task show 1", "state: started", f"delegated_to: {worker.id}", actor=story.agent)
    story.expect_text("task show 2", "state: open", f"delegated_to: {worker.id}", actor=story.agent)


def test_the_last_delivery_delivers_the_worktree_and_the_merge_closes_every_task(new_story):
    story, repository, worker = delegated_story(new_story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart total story"', actor=worker)
    story.run("worker next --wait --differences none", actor=worker)
    repository.changed(worker.id, "cart.py", "TOTAL = 3\n")
    story.expect_success('proof make 1 --task 2 "cart.py:1, the second story"', actor=worker)
    story.run("worker deliver --wait --differences none", actor=worker)
    story.expect_text("worker-worktree show 1", "state: delivered", actor=story.agent)
    story.expect_text("task show 1", "state: testing", actor=story.agent)
    story.expect_text("task show 2", "state: testing", actor=story.agent)
    story.run_listeners()
    expect_marks_text(story, "handed in task 1, task 2")
    story.run("proof check 1", actor=story.agent)
    story.run("proof check 2", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_text("task show 1", "state: completed", actor=story.agent)
    story.expect_text("task show 2", "state: completed", actor=story.agent)
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", "TOTAL = 3\n")


def test_releasing_a_worker_leaves_a_delegated_task_that_ended_alone(new_story):
    story, _, worker = delegated_story(new_story)
    story.expect_success('task cancel 2 --reason "not needed"', actor=story.agent)
    story.expect_success(f'worker release {agent_number(story, worker.id)} "not needed"', actor=story.agent)
    story.expect_text("task show 2", "state: cancelled", actor=story.agent)


def test_a_chained_queue_goes_on_while_the_workers_earlier_task_is_in_testing(new_story):
    story, _, worker = delegated_story(new_story)
    story.expect_success("task depend 2 --on 1", actor=story.agent)
    next_task = story.container.get(WorkerNextTask)
    story.expect_success("task test 1", actor=worker)
    expect_id_next_delegated(next_task, worker, 2)
    story.expect_success("task start 2", actor=worker)


def test_a_plan_hands_out_only_its_tasks_that_no_worker_was_given(new_story):
    story, _, _ = delegated_story(new_story)
    plan_id = story.new_row_id('plan make "Cart" --brief "The cart counts" --environment main', actor=story.agent)
    phase_id = story.new_row_id(f'phase make --plan {plan_id} "First" --goal "It counts"', actor=story.agent)
    story.expect_success(f"phase place 2 --phase {phase_id}", actor=story.agent)
    plans = story.container.get(NextPlanTasks)
    expect_ready_plan_tasks(story, plans, plan_id, [])
    free_id = story.new_row_id('task make "Fix the till" --environment main', actor=story.agent)
    story.expect_success(f"phase place {free_id} --phase {phase_id}", actor=story.agent)
    expect_ready_plan_tasks(story, plans, plan_id, [free_id])


def test_the_assigner_leaves_a_delegated_task_alone(new_story):
    story, _, _ = delegated_story(new_story)
    tasks = story.container.get(TaskQuery)
    expect_next_open_tasks(tasks, 1, "closed_at", None)


def test_the_board_lists_a_task_delegated_to_a_worker_under_its_state_and_has_no_delegated_group(new_story):
    story, _, worker = delegated_story(new_story)
    story.run('task make "My own job" --environment main', actor=story.agent)
    groups = {group["state"]: group for group in json.loads(story.run("task board --environment main --json", actor=story.user).output_text)["groups"]}
    delegated = [row for group in groups.values() for row in group["rows"] if row["delegated_to"] is not None]
    expect_value((sorted(row["id"] for row in delegated), {row["delegated_to"] for row in delegated}), ([1, 2], {worker.id}))
    expect_value("delegated" in groups, False)
    expect_total_started_groups(groups, 1)
    expect_id_open_groups(groups, [3, 2])



def expect_card_listed(story, filter_name: str, agent_id: int, listed: bool) -> None:
    outcome = story.run(f"agent cards --environment main --show {filter_name} --json", actor=story.agent)
    assert outcome.code == 0, outcome.output_text
    rows = json.loads(outcome.output_text)["rows"]
    assert (agent_id in [row["id"] for row in rows]) is listed, rows


def test_a_merged_worker_with_a_task_still_assigned_is_not_listed_as_running(new_story):
    story, repository, worker = delegated_story(new_story)
    expect_card_listed(story, "running", worker.id, True)
    third = story.new_row_id('task make "Check it later" --brief "Check the cart later"', actor=story.agent)
    story.expect_success(f"task assign {third} --to {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_success(f'task block {third} --reason "Waits for the release"', actor=story.agent)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart total story"', actor=worker)
    story.run("worker next --wait --differences none", actor=worker)
    repository.changed(worker.id, "cart.py", "TOTAL = 3\n")
    story.expect_success('proof make 1 --task 2 "cart.py:1, the second story"', actor=worker)
    story.run("worker deliver --wait --differences none", actor=worker)
    story.run_listeners()
    story.run("proof check 1", actor=story.agent)
    story.run("proof check 2", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    expect_card_listed(story, "running", worker.id, False)
    expect_card_listed(story, "idle", worker.id, True)
    expect_card_listed(story, "retired", worker.id, False)


def test_a_workers_facts_carry_its_model_profile_and_name_with_no_status_file(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = story.new_row_id("worker dispatch --test-command python=pytest --model sonnet --profile journal-medior --name Lovelace 1", actor=story.agent)
    story.expect_text("usage agents --environment main --json", f'"id": {worker}', '"model": "sonnet"', '"profile": "journal-medior"', '"given_name": "Lovelace"', actor=story.agent)


def expect_total_started_groups(groups, expected) -> None:
    actual = groups['started']['total']
    assert actual == expected, actual


def expect_id_open_groups(groups, expected) -> None:
    actual = [row['id'] for row in groups['open']['rows']]
    assert actual == expected, actual


def expect_next_open_tasks(tasks, number, text, expected) -> None:
    actual = tasks.next_open(None, IsNull(text))
    assert actual is expected, actual


def expect_ready_plan_tasks(story, plans, plan_id, expected) -> None:
    agent = story.container.get(Queries).query(Agent).find(story.agent.id)
    actual = [place.task_id for place in plans.ready(plan_id, agent)]
    assert actual == expected, actual


def expect_id_next_delegated(next_task, worker, expected) -> None:
    actual = next_task.following(worker.id).id
    assert actual == expected, actual
