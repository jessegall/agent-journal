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
    save_line = SAVE_ROTATING
    start_line = START_ROTATING

    def steps(self, story):
        story.expect_success(self.save_line, actor=story.user)
        launcher = FakeLauncher.listening(story.home.socket("launcher"))
        story.run(self.start_line, actor=story.agent)
        story.run_listeners()
        launcher.drain_requests()
        launcher.server.close()
        story.home.socket("launcher").unlink()
        story.expect_success(f"agent end {helper_agent(story).id}", actor=story.user)
        story.run_listeners()


class EndedContinueHelper(EndedEachLaunchHelper):
    """A helper of the personal profile steady, whose occupant is continue, that ended after its first job."""

    save_line = 'profile save steady --description "Reads one file" --body "' + ROTATING_BODY + '" --occupant continue --program claude --reason needed'
    start_line = 'helper start steady --brief "Read src/cart.py" --environment main'


class EndedColdRotationHelper(EndedEachLaunchHelper):
    """A helper of the personal profile cooling, whose occupant is when-cold, that ended after its first job."""

    save_line = 'profile save cooling --description "Reads one file" --body "' + ROTATING_BODY + '" --occupant when-cold --program claude --reason needed'
    start_line = 'helper start cooling --brief "Read src/cart.py" --environment main'


class StartedEachLaunchHelper(StoryFixture):
    """A helper of the personal profile rotating, whose occupant is each-launch, with its first job still open."""

    parent = UserBuilder

    def steps(self, story):
        story.expect_success(SAVE_ROTATING, actor=story.user)
        launcher = FakeLauncher.listening(story.home.socket("launcher"))
        story.run(START_ROTATING, actor=story.agent)
        story.run_listeners()
        launcher.drain_requests()
        launcher.server.close()
        story.home.socket("launcher").unlink()
