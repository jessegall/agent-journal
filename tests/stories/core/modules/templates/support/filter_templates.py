from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined


class FilterTemplates(StoryFixture):
    """Templates with different targets and purposes, including one with no target restriction."""

    parent = UserJoined

    def steps(self, story):
        story.run('template make "Plan critique" --applies-to plan --purpose critique', actor=story.user)
        story.run('template make "Doc critique" --applies-to doc --purpose critique', actor=story.user)
        story.run('template make "Plan testing" --applies-to plan --purpose testing', actor=story.user)
        story.run('template make "Any critique" --purpose critique', actor=story.user)
