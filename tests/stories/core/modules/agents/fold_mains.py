import pytest

from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.support.seeds.project_seeds import AgentActorSeed, AgentSeed


def test_with_one_main_row_the_check_has_nothing_to_fold(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_text("agent fold-mains --check", "nothing to fold", actor=story.user)


def test_a_second_main_row_in_an_environment_is_refused_by_the_database(new_story):
    story = new_story(fixture=UserBuilder)
    story.seed(AgentActorSeed, 1)
    with pytest.raises(Exception, match="UNIQUE constraint failed: agents.environment_id"):
        story.seed(AgentSeed, 1, role="main", number=7)
