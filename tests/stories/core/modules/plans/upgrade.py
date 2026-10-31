from tests.stories.core.upgrade.support.fixture_upgrade import upgraded_story


def test_a_plan_keeps_its_number_title_and_state(new_story):
    story = upgraded_story(new_story)
    story.expect_success("plan show 1", "title: Checkout", "state: approved")


def test_a_paused_plan_moves_as_approved_so_it_can_be_started_again(new_story):
    story = upgraded_story(new_story)
    story.expect_success("plan show 2", "title: Payments", "state: approved")


def test_a_plan_in_review_moves_as_ready_with_its_phases_checkpoint_and_tasks_in_order(new_story):
    story = upgraded_story(new_story)
    story.expect_success("plan show 3", "title: Cart rework", "state: ready")
    phases = story.run("phase list").output_text
    assert "Fix the total" in phases and "Ship it" in phases
    assert "checkpoint: True" in story.run("phase show 2").output_text or "checkpoint: 1" in story.run("phase show 2").output_text
    assert "phase_id: 1" in story.run("phase-task show 1").output_text and "position: 1" in story.run("phase-task show 1").output_text


def test_the_plan_reviews_of_version_4_are_dropped_and_counted(new_story):
    story = upgraded_story(new_story)
    assert "dropped plan_reviews: 2 rows" in story.upgrade_text


def test_a_task_version_4_left_in_two_phases_moves_into_its_last_and_the_older_link_is_counted(new_story):
    story = upgraded_story(new_story)
    assert "dropped in_phase links older than the task's last phase: 1 rows" in story.upgrade_text
    assert "phase_id: 2" in next(story.run(f"phase-task show {n}").output_text for n in (1, 2, 3) if "task_id: 2" in story.run(f"phase-task show {n}").output_text)
