import json

import pytest

from engine.testing.stories.story import Story
from tests.stories.core.modules.tasks.assigned_reads import TwoWorkersFourTasks, assign, worker_v, worker_w

BOARD = "task board --environment main --state open --json"


@pytest.fixture
def workshop(new_story):
    return new_story(fixture=TwoWorkersFourTasks)


def open_cards(story: Story) -> dict[int, dict[str, object]]:
    board = json.loads(story.run(BOARD, actor=story.user).output_text)
    return {row["id"]: row for row in board["groups"][0]["rows"]}


def assignee_facts(card: dict[str, object]) -> tuple[object, ...]:
    return card["assigned_actor_id"], card["assigned_type"], card["is_main_assignee"]


def test_the_board_names_the_main_agent_a_worker_or_a_person_as_the_assignee_and_nobody_for_a_free_task(workshop):
    assign(workshop, 1, workshop.agent)
    assign(workshop, 2, worker_w(workshop))
    assign(workshop, 3, workshop.user)
    cards = open_cards(workshop)
    workshop.expect_rows(assignee_facts(cards[1]) == (workshop.agent.id, "agent", True), assignee_facts(cards[2]) == (worker_w(workshop).id, "agent", False),
                         assignee_facts(cards[3]) == (workshop.user.id, "user", False), cards[3]["assigned_name"] == "Ada",
                         assignee_facts(cards[4]) == (None, None, False), detail=str(cards))


def test_task_info_says_assigned_to(workshop):
    workshop.expect_text("task info 1", "assigned to: nobody", actor=workshop.agent)
    assign(workshop, 1, worker_w(workshop))
    workshop.expect_text("task info 1", f"assigned to: agent {worker_w(workshop).id}", actor=workshop.agent)
    assign(workshop, 1, workshop.user)
    workshop.expect_text("task info 1", "assigned to: Ada", actor=workshop.agent)
    workshop.expect_absent("task info 1", "delegated", actor=workshop.agent)


def test_assignment_list_by_subject_and_actor_lists_a_workers_whole_work(workshop):
    assign(workshop, 1, worker_w(workshop))
    assign(workshop, 3, worker_w(workshop))
    assign(workshop, 2, worker_v(workshop))
    listed = json.loads(workshop.run(f"assignment list --subject-model task --actor {worker_w(workshop).id} --oldest --json --environment main", actor=workshop.user).output_text)["rows"]
    workshop.expect_rows([row["subject_id"] for row in listed] == [1, 3], all(row["actor_id"] == worker_w(workshop).id for row in listed), detail=str(listed))
