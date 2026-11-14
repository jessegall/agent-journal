from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import AgentStarted


class OpenQuestion(StoryFixture):
    """One open question, Which database? (1), with the options sqlite and postgres, asked by the main agent
    in main."""

    parent = AgentStarted

    def steps(self, story: Story) -> None:
        story.run('question ask "Which database?" --context "A story asks this so its card and answer can be checked." --options sqlite postgres --environment main', actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success("question show 1", "state: open")


class AnsweredQuestion(StoryFixture):
    """The question Which database? (1), answered sqlite."""

    parent = OpenQuestion

    def steps(self, story: Story) -> None:
        story.run("question answer 1 --answer sqlite")

    def expect(self, story: Story) -> None:
        story.expect_success("question show 1", "state: answered")
