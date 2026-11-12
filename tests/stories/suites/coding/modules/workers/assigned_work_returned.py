from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder
from tests.stories.suites.coding.modules.workers.support.phase_steps import single_task_worker, unplanned_group_worker, unplanned_worker
from tests.stories.suites.coding.support.main_controls_fixture import MainControlsActors, agent_actors


def test_a_helper_whose_worktree_is_not_cut_takes_no_task(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_success('task make "Fix the cart" --brief "Do it" --environment main', actor=story.agent)
    for name in ("helper", "worker"):
        story.expect_refusal(f"task assign 1 --to {agent_number(story, agent_actors(story)[name].id)}", "takes no task", actor=story.agent)
    story.expect_text("task info 1", "assigned to: nobody", actor=story.agent)


def test_a_person_assignee_skips_the_agent_only_checks(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    story.expect_success(f"assign task 1 --to {story.user.id} --environment main", actor=story.user)
    story.expect_text("task info 1", "state: open", actor=story.agent)


def test_a_worker_that_is_released_gives_back_its_waiting_tasks_open_and_blocked_and_they_become_unassigned(new_story, monkeypatch):
    worker = unplanned_group_worker(new_story, monkeypatch)
    story = worker.story
    story.expect_success('task block 3 --reason "needs an answer"', actor=story.agent)
    story.expect_success(f'worker release {agent_number(story, worker.worker.id)} "wrong job"', actor=story.agent)
    story.expect_text("task show 2", "state: open", actor=story.agent)
    story.expect_text("task show 3", "state: blocked", actor=story.agent)
    for task in (2, 3):
        story.expect_text(f"task info {task}", "assigned to: nobody", actor=story.agent)
        story.expect_absent(f"task info {task}", "assigned to", actor=story.agent)


def test_a_worker_that_is_released_returns_its_started_task_to_open_and_unassigned(new_story, monkeypatch):
    worker = unplanned_worker(new_story, monkeypatch)
    story = worker.story
    story.expect_success(f'worker release {agent_number(story, worker.worker.id)} "wrong job"', actor=story.agent)
    for task in (1, 2):
        story.expect_text(f"task show {task}", "state: open", actor=story.agent)
        story.expect_absent(f"task info {task}", "assigned to", actor=story.agent)


def test_a_worker_whose_last_started_task_is_moved_away_by_someone_else_is_refused_with_the_last_task_of_worker_message(new_story, monkeypatch):
    worker = single_task_worker(new_story, monkeypatch)
    story = worker.story
    story.expect_refusal(f"task assign 1 --to {agent_number(story, story.agent.id)}", "is the last of", actor=story.agent)
    story.expect_text("task show 1", "state: started", f"holder_id: {worker.worker.id}", actor=story.agent)
