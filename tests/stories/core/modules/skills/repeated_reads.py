from core.modules.skills.support.skill_requirement import SkillRequirement
from core.modules.skills.support.unread_skills import UnreadSkills
from tests.stories.core.modules.skills.due import environment, start
from core.modules.skills.support.start_skills import SESSION_START_KEY


def test_one_request_asks_for_the_due_skills_of_an_agent_many_times_and_reads_them_once(new_story):
    story = environment(new_story)
    story.run(f'setting make {SESSION_START_KEY} \'["journal-notes"]\'')
    story.replace(SkillRequirement, SkillRequirement())
    start(story)
    unread = story.container.get(UnreadSkills)
    with story.repeated_work.request():
        answers = [unread.names(story.agent.id) for _ in range(12)]
    story.expect_rows(answers[0] == ["journal-notes"], all(answer == answers[0] for answer in answers))
