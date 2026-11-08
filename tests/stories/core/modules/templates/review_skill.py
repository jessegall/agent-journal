from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderWithUser

REPORT_COMMAND = 'report make "Critique" --abstract "What the review found" --body "Fine" --about plan:1 --environment main'
CRITIQUE_COMMAND = 'template send 1 --on=plan:1 --set=agents=2 --set=size="a normal read" --environment main'
SKILL_LINE = "journal-plan-review-applying"


class PlanUnderReviewOfTheMainAgent(StoryFixture):
    """Plan 1, made by the main agent, was sent for a critique by Ada, so it is under review."""

    parent = BuilderWithUser

    def steps(self, story) -> None:
        story.run("skill write")
        story.expect_success('template make "Read it" --brief "Say what is wrong" --applies-to plan --purpose critique', actor=story.user)
        story.expect_success('plan make "Cart plan" --environment main', actor=story.agent)
        story.expect_success("plan ready 1", actor=story.agent)
        story.expect_success(CRITIQUE_COMMAND, actor=story.user)

    def expect(self, story) -> None:
        story.expect_text("plan show 1", "state: reviewing")


def due_skills(story, agent: Actor) -> str:
    return story.run(f"agent-skill list --agent {agent.id}").output_text


def test_the_main_agent_must_read_the_review_applying_skill_when_the_critique_report_arrives(new_story):
    story = new_story(fixture=PlanUnderReviewOfTheMainAgent)
    story.expect_rows(SKILL_LINE not in due_skills(story, story.agent))
    story.expect_success(REPORT_COMMAND, actor=story.agent)
    story.run_listeners()
    story.expect_text(f"agent-skill list --agent {story.agent.id}", f"{SKILL_LINE}  due")


def test_a_helper_that_made_the_plan_must_read_the_skill_when_the_critique_report_arrives(new_story):
    story = new_story(fixture=BuilderWithUser, environment="main")
    story.run("skill write")
    helper = Actor(story.new_row_id(f"agent start s-2 claude helper --parent {story.agent.id}"), ActorType.AGENT)
    story.expect_success('template make "Read it" --brief "Say what is wrong" --applies-to plan --purpose critique', actor=story.user)
    story.expect_success('plan make "Helper plan"', actor=helper)
    story.expect_success("plan ready 1", actor=helper)
    story.expect_success(CRITIQUE_COMMAND, actor=story.user)
    story.expect_success(REPORT_COMMAND, actor=story.agent)
    story.run_listeners()
    story.expect_rows(f"{SKILL_LINE}  due" in due_skills(story, helper))


def test_a_report_about_a_plan_not_under_review_makes_no_skill_due(new_story):
    story = new_story(fixture=BuilderWithUser, environment="main")
    story.expect_success('plan make "Cart plan"', actor=story.agent)
    story.expect_success(REPORT_COMMAND, actor=story.agent)
    story.run_listeners()
    story.expect_rows(SKILL_LINE not in due_skills(story, story.agent))
