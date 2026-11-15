from collections.abc import Callable

import pytest

from core.modules.drivers.support.driver_settings import ACTIVE_SLICES_SETTING


def walk_only(story):
    """Turns every slice of the new driver off for the story, so it tests the old walk while the walk still answers."""
    story.run(f"setting set {ACTIVE_SLICES_SETTING} '[]' --environment main", actor=story.user)
    return story


@pytest.fixture
def walk_played(played) -> Callable[..., object]:
    """The played journal with no slice of the new driver live: what a test of the old walk's own machinery runs on
    until task 10324 deletes it with the walk."""
    return lambda *arguments, **fields: walk_only(played(*arguments, **fields))
