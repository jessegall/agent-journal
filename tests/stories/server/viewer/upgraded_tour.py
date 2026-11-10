from tests.stories.server.support.server_fixtures import person_server, upgraded_server

import pytest

from tests.stories.engine.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.fixtures.viewer_tour import prepare_completed_tour, prepare_pending_tour
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from tests.stories.server.support.tour_browser import expect_browser_tour

pytestmark = pytest.mark.browser_job


def test_a_seen_version_four_tour_stays_closed_in_a_fresh_browser_after_upgrade(completed_tour_server):
    expect_browser_tour(completed_tour_server, visible=False)


def test_an_unseen_version_four_tour_is_offered_after_upgrade(pending_tour_server):
    expect_browser_tour(pending_tour_server, visible=True)


def test_an_upgrade_without_a_tour_setting_still_offers_the_tour(upgraded_server):
    story = upgraded_server
    expect_browser_tour(story, visible=True)


def test_a_new_journal_still_offers_its_first_use_tour(person_server):
    story = person_server
    expect_browser_tour(story, visible=True, login_name="Ada")


@pytest.fixture
def completed_tour_server(new_story):
    with server_story(upgraded_story(new_story, prepare=prepare_completed_tour)) as story:
        yield story


@pytest.fixture
def pending_tour_server(new_story):
    with server_story(upgraded_story(new_story, prepare=prepare_pending_tour)) as story:
        yield story




