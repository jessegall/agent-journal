from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.seeds.fold_seeds import FOLDED_AGENT_ID, FOLDED_NUMBER, AgentFoldSeed


def folded_story(new_story):
    story = new_story(fixture=UserBuilder)
    story.seed(AgentFoldSeed, 1, survivor_id=story.agent.id)
    return story


def test_the_old_number_of_a_folded_main_row_shows_the_main_agent(new_story):
    story = folded_story(new_story)
    story.expect_text(f"agent show {FOLDED_NUMBER} --environment main", f"id: {story.agent.id}", "number: 1", actor=story.user)


def test_a_mention_of_a_folded_agent_shows_agent_one(new_story):
    story = folded_story(new_story)
    story.expect_success(f'memory make "Ask agent:{FOLDED_AGENT_ID} about the till" --weight 5', actor=story.agent)
    story.expect_text("memory list", "agent 1", actor=story.agent)
