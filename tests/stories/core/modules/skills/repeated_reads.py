from core.modules.skills.support.skill_requirement import SkillRequirement
from core.modules.skills.support.unread_skills import UnreadSkills
from tests.stories.core.modules.skills.due import environment, start


def test_one_request_asks_for_the_due_skills_of_an_agent_many_times_and_reads_them_once(new_story):
    story = environment(new_story)
    story.run('setting make journal.core.skills.session-start \'["journal-notes"]\'')
    story.container.bind(SkillRequirement, SkillRequirement())
    start(story)
    unread = story.container.get(UnreadSkills)
    with story.repeated_work.request():
        asked = [unread.names(story.agent.id) for _ in range(12)]
    story.expect_rows(asked[0] == ["journal-notes"], all(names == asked[0] for names in asked))
