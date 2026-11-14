import pytest

from engine.listener.errors.listener_rebuilt_error import ListenerRebuiltError
from tests.stories.core.support.fixtures import StartedPlanTask
from tests.stories.support.listener_builds import LISTENER_THREAD, build_twice

def test_building_a_set_twice_for_one_registry_raises_naming_the_thread_and_the_registry(new_story):
    story = new_story(fixture=StartedPlanTask)
    with pytest.raises(ListenerRebuiltError) as raised:
        build_twice(story.home, LISTENER_THREAD)
    assert raised.value.thread_name == LISTENER_THREAD
    assert raised.value.fingerprint in str(raised.value)
