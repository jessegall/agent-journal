from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined


class SecretMade(StoryFixture):
    """Secret 1, Github, an API key the agent made, empty and given to no program."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        story.run('secret make "Github" --environment main', story.agent)

    def expect(self, story: Story) -> None:
        story.expect_text("secret show 1", "key  GITHUB_KEY  waiting for the user, hidden", "given to: no program yet")


class SecretAllowed(StoryFixture):
    """The user let secret 1 go to head, printenv and tr; its value is still to be filled."""

    parent = SecretMade

    def steps(self, story: Story) -> None:
        for program in ("head", "printenv", "tr"):
            story.run(f"secret allow 1 {program}", story.user)

    def expect(self, story: Story) -> None:
        story.expect_text("secret show 1", "given to: head, printenv, tr")


class ServersInstalled(StoryFixture):
    """The user installed github, which needs its key, linear, which signs in, and context7; the configs they wrote
    stay with the fixture, so a story that reads them installs its own."""

    parent = UserJoined

    def steps(self, story: Story) -> None:
        for name in ("github", "linear", "context7"):
            story.run(f"mcp install {name}", story.user)

    def expect(self, story: Story) -> None:
        story.expect_text("mcp list", "github  needs its key  GitHub", "context7  ready  Context7")
