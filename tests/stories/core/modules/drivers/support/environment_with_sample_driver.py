from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import MainEnvironment


class SampleDriverEnvironment(StoryFixture):
    """An environment explicitly runs the sample suite and its main driver."""

    parent = MainEnvironment

    def steps(self, story):
        story.expect_success("suite choose samples --environment main")
        story.expect_success("driver choose samples.lead --environment main")

    def expect(self, story):
        story.expect_success("suite current main", "suite: samples", "drivers: main: samples.lead")
