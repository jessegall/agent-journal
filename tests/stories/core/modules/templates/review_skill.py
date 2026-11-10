from core.base.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.support.coding_fixtures import UserBuilder

REPORT_COMMAND = 'report make "Critique" --abstract "What the review found" --body "Fine" --about plan:1 --environment main'
CRITIQUE_COMMAND = 'template send 1 --on=plan:1 --set=agents=2 --set=size="a normal read" --environment main'
SKILL_LINE = "journal-plan-review-applying"


def due_skills(story, agent: Actor) -> str:
    return story.run(f"agent-skill list --agent {agent.id}").output_text


def test_a_helper_that_made_the_plan_must_read_the_skill_when_the_critique_report_arrives(new_story):
    story = new_story(fixture=UserBuilder, environment="main")
    story.run("skill write")
    helper = Actor(story.new_row_id(f"agent start s-2 claude helper --parent {story.agent.id}"), ActorType.AGENT)
    story.expect_success('template make "Read it" --brief "Say what is wrong" --applies-to plan --purpose critique', actor=story.user)
    story.expect_success('plan make "Helper plan"', actor=helper)
    story.expect_success("plan ready 1", actor=helper)
    story.expect_success(CRITIQUE_COMMAND, actor=story.user)
    story.expect_success(REPORT_COMMAND, actor=story.agent)
    story.run_listeners()
    story.expect_rows(f"{SKILL_LINE}  due" in due_skills(story, helper))
