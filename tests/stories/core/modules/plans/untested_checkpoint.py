from tests.stories.core.modules.plans.checkpoints import PASSES, REACHES, WindowsPlan, close, rows


def test_185_a_reached_checkpoint_with_no_test_to_run_says_so_in_the_log_and_passes_at_once(new_story):
    story = new_story(fixture=WindowsPlan)
    close(story, 1, 2, 3)
    story.expect_text("task-log list --task 3", "checkpoint phase 3 had no test to run", actor=story.agent)
    story.expect_rows(rows(story, REACHES)[0]["state"] == "passed", [row["phase_id"] for row in rows(story, PASSES)] == [3], detail=str(rows(story, REACHES)))
