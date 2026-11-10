from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.helpers.helper_jobs import helper_agent
from tests.stories.core.support.coding_fixtures import UserBuilder

ROTATING_BODY = "Read one file and say what it does."
SAVE_ROTATING = ('profile save rotating --description "Reads one file" --body "' + ROTATING_BODY + '" --occupant each-launch --program claude'
                 " --fallback-programs claude,codex --program-if-possible --reason needed")
START_ROTATING = 'helper start rotating --brief "Read src/cart.py" --environment main'


class EndedEachLaunchHelper(StoryFixture):
    """A helper of the personal profile rotating, whose occupant is each-launch, that ended after its first job."""

    parent = UserBuilder

    def steps(self, story):
        story.expect_success(SAVE_ROTATING, actor=story.user)
        launcher = FakeLauncher.listening(story.home.socket("launcher"))
        story.run(START_ROTATING, actor=story.agent)
        story.run_listeners()
        launcher.drain_requests()
        launcher.server.close()
        story.home.socket("launcher").unlink()
        story.expect_success(f"agent end {helper_agent(story).id}", actor=story.user)
        story.run_listeners()
