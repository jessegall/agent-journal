import pytest

from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.core.support.fixtures import ThreeTasks, UserJoined
from tests.stories.server.support.server_client import server_story


@pytest.fixture
def person_server(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        yield story


@pytest.fixture
def task_server(new_story):
    with server_story(new_story(fixture=ThreeTasks)) as story:
        yield story


@pytest.fixture
def upgraded_server(new_story):
    with server_story(upgraded_story(new_story)) as story:
        yield story
