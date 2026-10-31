from tests.stories.core.modules.skills.agent_skills import GOOD
from tests.stories.core.support.coding_fixtures import BuilderStarted


def started(new_story):
    return new_story(GOOD, fixture=BuilderStarted)


def test_an_agent_skill_is_made_due_with_no_digest(new_story):
    story = started(new_story)
    story.expect_success(f"agent-skill make {story.agent.id} journal-notes", "state: due", f"agent_id: {story.agent.id}", "skill: journal-notes")


def test_a_skill_is_due_once_for_an_agent(new_story):
    story = started(new_story)
    story.run(f"agent-skill make {story.agent.id} journal-notes")
    story.expect_refusal(f"agent-skill make {story.agent.id} journal-notes", "exists already")


def test_a_due_skill_loads_and_a_loaded_one_resets_to_due(new_story):
    story = started(new_story)
    story.run(f"agent-skill make {story.agent.id} journal-notes")
    story.expect_success("agent-skill load 1 --digest abc123", "state: loaded", "digest: abc123")
    story.expect_success("agent-skill reset 1", "state: due")


def test_a_due_skill_cannot_load_twice_or_reset(new_story):
    story = started(new_story)
    story.run(f"agent-skill make {story.agent.id} journal-notes")
    story.run("agent-skill load 1 --digest abc123")
    story.expect_refusal("agent-skill load 1 --digest abc123", "cannot load")
