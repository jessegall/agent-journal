import json

from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.plan_steps import started_plan
from engine.testing.stories.story_fixture import StoryFixture


class ThreeStartedPlans(StoryFixture):
    """Plans 1, 2 and 3 are started in main by the person."""

    parent = UserBuilder

    def steps(self, story) -> None:
        for plan_id, title in ((1, "Foundation"), (2, "Walls"), (3, "Roof")):
            started_plan(story, plan_id, title)

    def expect(self, story) -> None:
        story.expect_text("plan show 3", "state: started", actor=story.user)


def inspected(story, plan_id: int) -> dict:
    return json.loads(story.run(f"plan inspect {plan_id} --json", actor=story.user).output_text)


def test_a_plan_blocked_on_two_plans_opens_when_the_second_ends_and_the_main_agent_is_told(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.expect_success("plan block 1 --on plan:2 --on plan:3", "state: blocked", actor=story.user)
    story.expect_rows(inspected(story, 1)["blocker_ids"] == [2, 3])
    story.expect_success('plan cancel 2 --reason "Not needed"', actor=story.user)
    story.expect_text("plan show 1", "state: blocked", actor=story.user)
    story.expect_rows(inspected(story, 1)["blocker_ids"] == [3])
    story.expect_absent(f"agent-line list --agent {story.agent.id}", "plan:1 is open again", actor=story.user)
    story.expect_success('plan cancel 3 --reason "Not needed either"', actor=story.user)
    story.expect_text("plan show 1", "state: started", actor=story.user)
    story.expect_rows(inspected(story, 1)["blocker_ids"] == [])
    story.expect_text(f"agent-line list --agent {story.agent.id}", "plan:1 is open again", actor=story.user)


def test_a_plan_blocked_with_only_a_reason_stays_blocked_until_it_is_unblocked(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.expect_success('plan block 1 --reason "a pause"', "state: blocked", actor=story.user)
    story.expect_success('plan cancel 2 --reason "Not needed"', actor=story.user)
    story.expect_text("plan show 1", "state: blocked", actor=story.user)
    story.expect_success("plan unblock 1", "state: started", actor=story.user)


def test_a_plan_cannot_wait_on_itself_a_finished_plan_or_a_plan_that_waits_on_it(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.expect_refusal("plan block 1 --on plan:1", "cannot wait on itself", actor=story.user)
    story.expect_refusal("plan block 1 --on task:2", "gives nothing to wait on", actor=story.user)
    story.expect_success('plan cancel 3 --reason "Not needed"', actor=story.user)
    story.expect_refusal("plan block 1 --on plan:3", "plan 3 is cancelled already", actor=story.user)
    story.expect_text("plan show 1", "state: started", actor=story.user)
    story.expect_success("plan block 2 --on plan:1", actor=story.user)
    story.expect_success("plan unblock 2", actor=story.user)
    story.expect_success("plan block 1 --on plan:2", actor=story.user)
    story.expect_refusal("plan block 2 --on plan:1", "closes a circle", actor=story.user)


def test_ending_a_plan_unblocks_a_waiting_plan_that_the_person_unblocked_already_no_more(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.expect_success("plan block 1 --on plan:2", actor=story.user)
    story.expect_success("plan unblock 1", actor=story.user)
    story.expect_rows(inspected(story, 1)["blocker_ids"] == [])
    story.expect_success('plan cancel 2 --reason "Not needed"', actor=story.user)
    story.expect_text("plan show 1", "state: started", actor=story.user)


def test_a_task_cannot_wait_on_its_own_plan(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.expect_refusal("task block 1 --on plan:1", "closes a circle: task 1 -> plan 1 -> task 1", actor=story.user)


def test_a_task_cannot_wait_on_a_plan_that_waits_on_the_task_own_plan(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.expect_success("plan block 2 --on plan:1", actor=story.user)
    story.expect_refusal("task block 1 --on plan:2", "closes a circle: task 1 -> plan 2 -> plan 1 -> task 1", actor=story.user)


def test_a_plan_cannot_wait_on_a_plan_whose_task_waits_on_the_first_plan(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.expect_success("task block 3 --on plan:1", actor=story.user)
    story.expect_refusal("plan block 1 --on plan:2", "closes a circle: plan 1 -> plan 2 -> task 3 -> plan 1", actor=story.user)
