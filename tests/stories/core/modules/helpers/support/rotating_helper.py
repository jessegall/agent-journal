from core.modules.agents.testing.fake_launcher import FakeLauncher
from pathlib import Path

from engine.journal.journal_home import JournalHome
from engine.provider.managed_hooks import ManagedHooks
from engine.provider.providers import Providers
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.helpers.support.program_states import ProgramStates
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
        launcher = FakeLauncher.accepting(story.home.socket("launcher"))
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
    save_line = SAVE_ROTATING

    def steps(self, story):
        story.expect_success(self.save_line, actor=story.user)
        launcher = FakeLauncher.accepting(story.home.socket("launcher"))
        story.run(START_ROTATING, actor=story.agent)
        story.run_listeners()
        launcher.drain_requests()
        launcher.server.close()
        story.home.socket("launcher").unlink()


def real_program_states(story) -> None:
    """Makes the story read program outages from its rows, where a story otherwise finds every program ready."""
    story.container.bind(ProgramStates, story.container.constructed(ProgramStates))


class InstalledProgramChecks(HelperPrograms):
    """Asks whether a program is installed and leaves its hooks and folder alone, since a story's folders do
    not exist."""

    def checked(self, program: str, folder: Path) -> None:
        self.installed(program)


def installed_program_checks(story) -> None:
    """Makes the story ask whether a program is installed, where a story otherwise passes every program."""
    story.container.bind(HelperPrograms, InstalledProgramChecks(story.container.get(JournalHome), story.container.get(Providers), story.container.get(ManagedHooks)))


def story_with_profile_file(new_story, fixture: type[EndedEachLaunchHelper] | type[StartedEachLaunchHelper]):
    """A story on the fixture with its profile file saved again: a fixture's copy holds the database, and the
    profile file its steps wrote is not in the story's folder."""
    story = new_story(fixture=fixture)
    story.expect_success(fixture.save_line, actor=story.user)
    return story
