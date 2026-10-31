from tests.core.modules.tasks.task_lifecycle import started_story


def test_a_plan_is_made_as_a_draft_in_the_callers_environment(new_story):
    story = started_story(new_story)
    story.expect_success('plan make "Version 5 core" --brief "the core and its modules" --environment main', "state: draft", "environment_id: 1")


def test_a_plan_moves_from_draft_to_completed(new_story):
    story = started_story(new_story)
    story.run('plan make "Version 5 core" --environment main')
    story.expect_success("plan ready 1", "state: ready")
    story.expect_success("plan approve 1", "state: approved")
    story.expect_success("plan start 1", "state: started", actor=story.agent)
    story.expect_success('plan pause 1 --reason "the user asked"', "state: paused", "reason: the user asked", actor=story.agent)
    story.expect_success("plan resume 1", "state: started", actor=story.agent)
    story.expect_success('plan block 1 --reason "waits on a decision"', "state: blocked", actor=story.agent)
    story.expect_success("plan unblock 1", "state: started", actor=story.agent)
    story.expect_success("plan close 1", "state: completed", "closed_at: 2026-10-31T09:00:00.000000+00:00", actor=story.agent)


def test_a_plan_is_cancelled_with_its_reason(new_story):
    story = started_story(new_story)
    story.run('plan make "Version 5 core" --environment main')
    story.expect_success('plan cancel 1 --reason "replaced"', "state: cancelled", "reason: replaced")


def test_a_move_out_of_a_wrong_state_is_refused_with_the_moves_that_go_on(new_story):
    story = started_story(new_story)
    story.run('plan make "Version 5 core" --environment main')
    story.expect_refusal("plan start 1", "from draft it can only go on with journal plan ready 1, journal plan cancel 1")
    story.expect_refusal("plan approve 1", "plan 1 is draft, so it cannot approve")
