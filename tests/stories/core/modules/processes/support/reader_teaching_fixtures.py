from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted


class TwoRunsWithSameTitle(StoryFixture):
    """Two background runs have the same title."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        install_runner(story)
        for line in ("make one", "make two"):
            process = moved_run(story, line)
            story.run(f'output title {process.id} "Building it"', actor=story.agent)
