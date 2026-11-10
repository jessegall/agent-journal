import json

from tests.stories.engine.upgrade.support.fixture_upgrade import upgraded_story, expect_upgrade_text


def test_a_plan_in_review_moves_as_ready_with_its_phases_checkpoint_and_tasks_in_order(new_story):
    story = upgraded_story(new_story)
    story.expect_success("plan show 3", "title: Cart rework", "state: ready")
    phases = story.run("phase list")
    phases.expect_text("Fix the total")
    phases.expect_text("Ship it")
    expect_value_9("checkpoint: True", story, "phase show 2", "checkpoint: 1", "phase show 2")
    story.expect_text("phase-task show 1", "phase_id: 1")
    story.expect_text("phase-task show 1", "position: 1")


def test_a_phase_of_an_upgraded_plan_reads_with_an_empty_test_command(new_story):
    story = upgraded_story(new_story)
    story.expect_success("plan show 3", "title: Cart rework")
    story.expect_rows(json.loads(story.run("phase show 1 --json").output_text)["test_command"] == "")


def test_the_plan_reviews_of_version_4_are_dropped_and_counted(new_story):
    story = upgraded_story(new_story)
    expect_upgrade_text(story, "dropped plan_reviews: 2 rows")


def test_a_task_version_4_left_in_two_phases_moves_into_its_last_and_the_older_link_is_counted(new_story):
    story = upgraded_story(new_story)
    expect_upgrade_text(story, "dropped in_phase links older than the task's last phase: 1 rows")
    expect_next_with(story, 1, 2, 3, "task_id: 2", "phase_id: 2")


def expect_next_with(story, number, number_2, number_3, text, expected) -> None:
    actual = next((story.run(f'phase-task show {n}').output_text for n in (number, number_2, number_3) if text in story.run(f'phase-task show {n}').output_text))
    assert expected in actual, actual


def expect_value_9(text, story, text_2, text_3, text_4) -> None:
    actual = text in story.run(text_2).output_text or text_3 in story.run(text_4).output_text
    assert actual, actual
