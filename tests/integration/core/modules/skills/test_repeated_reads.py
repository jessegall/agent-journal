import pytest

from core.modules.skills.support.missing_command_skill import MissingCommandSkill
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.agent_skill_rows import AgentSkillRows
from tests.stories.core.modules.skills.due import environment, start


@pytest.fixture
def started_story(played):
    story = environment(played)
    start(story)
    return story


def test_repeated_skill_load_checks_share_the_agents_skill_row(started_story):
    story = started_story
    story.expect_success(f"skill require {story.agent.id} journal-notes")
    rows = story.container.get(AgentSkillRows)
    with story.repeated_work.request():
        answers = [rows.find(story.agent.id, "journal-notes") for _ in range(12)]
    story.expect_rows(all(row is not None and row.skill == "journal-notes" for row in answers))


def test_one_request_looks_for_a_missing_command_skill_among_many_skills_and_reads_the_loaded_rows_once(started_story):
    story = started_story
    commands = {command for skill in story.container.get(SkillCatalogue).skills() for command in skill.commands}
    missing = story.container.get(MissingCommandSkill)
    with story.repeated_work.request():
        answers = [missing.first(story.agent.id, commands) for _ in range(12)]
    story.expect_rows(answers[0] is not None, all(answer == answers[0] for answer in answers), detail=str(answers))
