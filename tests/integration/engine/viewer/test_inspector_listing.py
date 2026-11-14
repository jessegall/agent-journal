from server.viewer.windows_route import WindowsRoute
from tests.stories.engine.viewer.support.inspector_modules import PATH as PLAIN_PATH
from tests.stories.support.story_checks import expect_value


def read_inspectors(story):
    return {listing.term: listing for listing in WindowsRoute(story.home).inspectors("main")}


def test_the_windows_list_is_unchanged(journal):
    previous = sorted(WindowsRoute(journal.home).windows("main"), key=lambda window: window.name)
    journal.expect_sync_success(f"{PLAIN_PATH}:InspectorModule")
    expect_value(sorted(WindowsRoute(journal.home).windows("main"), key=lambda window: window.name), previous)
