from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.fixtures.viewer_tour import prepare_completed_tour, prepare_pending_tour
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from tests.stories.server.support.tour_browser import expect_browser_tour


def test_a_seen_version_four_tour_stays_closed_in_a_fresh_browser_after_upgrade(new_story):
    journal_story = upgraded_story(new_story, prepare=prepare_completed_tour)
    with server_story(journal_story) as story:
        expect_browser_tour(story, visible=False)


def test_an_unseen_version_four_tour_is_offered_after_upgrade(new_story):
    journal_story = upgraded_story(new_story, prepare=prepare_pending_tour)
    with server_story(journal_story) as story:
        expect_browser_tour(story, visible=True)


def test_an_upgrade_without_a_tour_setting_still_offers_the_tour(new_story):
    with server_story(upgraded_story(new_story)) as story:
        expect_browser_tour(story, visible=True)


def test_a_new_journal_still_offers_its_first_use_tour(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        expect_browser_tour(story, visible=True, login_name="Ada")
