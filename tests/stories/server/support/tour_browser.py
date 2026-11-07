from tests.stories.server.support.server_client import ServerStory
from tests.stories.server.support.browser_story import expect_browser


def expect_browser_tour(story: ServerStory, visible: bool, login_name: str = "Jesse") -> None:
    expect_browser(story, "upgradeTour.browser.mjs", [str(visible).lower()], login_name)
