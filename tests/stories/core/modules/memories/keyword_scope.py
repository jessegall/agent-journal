from tests.stories.core.support.fixtures import UserJoined


def test_an_agent_gives_its_own_environment_s_memory_a_keyword(new_story):
    story = new_story(fixture=UserJoined)
    memory_id = story.new_row_id('memory make "The cart total is in cents" --environment main', actor=story.agent)
    story.expect_success(f"memory-keyword make {memory_id} cart", "word: cart", actor=story.agent)
