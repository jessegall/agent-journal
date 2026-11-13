from core.modules.agents.guards.agent_name_guard import PLAIN_NAME
from core.modules.agents.testing.fake_launcher import FakeLauncher
from tests.stories.core.support.coding_fixtures import UserBuilder
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE


def test_an_agent_name_with_a_description_is_refused(new_story):
    story = new_story(fixture=UserBuilder)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    try:
        story.expect_refusal(f'helper start {RESEARCHER_PROFILE.name} --name "Mary Shelley, window converter" --brief "Read src/till.py" --environment main',
                             "an agent's name is only the name", actor=story.agent)
    finally:
        launcher.server.close()
        story.home.socket("launcher").unlink(missing_ok=True)


def test_a_person_name_is_a_plain_name(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_rows(all(PLAIN_NAME.fullmatch(name) for name in ("Mary Shelley", "Sir Tony Hoare", "Grace Murray", "Dr. O'Neil-Smith", "Ada")),
                      not any(PLAIN_NAME.fullmatch(name) for name in ("Mary, Shelley", "Ada (reader)", "Worker 12", "Ada: reader")))
