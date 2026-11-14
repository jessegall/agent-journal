import pytest

from core.modules.developer.support.developer_settings import PREVENT_LAZY_LOADING_SETTING, TOOLS_SETTING
from engine.command.command import Command
from engine.command.handler import Handler
from engine.errors.late_resolve_error import LateResolveError
from server.work.kept_round_container import KeptRoundContainer
from tests.stories.core.support.fixtures import UserJoined


class LateCommand(Command[None]):
    """A command no module registers, whose handler only a late build would make."""


class LateHandler(Handler[LateCommand, None]):
    pass


def test_with_lazy_loading_prevented_a_kept_container_builds_at_boot_and_refuses_a_late_build(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting switch {TOOLS_SETTING} on --project", actor=story.user)
    story.expect_success(f"setting set {PREVENT_LAZY_LOADING_SETTING} true --project", actor=story.user)
    kept = KeptRoundContainer(story.home)
    try:
        container = kept.round_container()
        story.expect_rows(container.is_sealed)
        with pytest.raises(LateResolveError, match="LateHandler was built after boot"):
            container.get(LateHandler)
    finally:
        kept.close()


def test_without_the_setting_a_kept_container_builds_as_it_goes(new_story):
    story = new_story(fixture=UserJoined)
    kept = KeptRoundContainer(story.home)
    try:
        container = kept.round_container()
        story.expect_rows(not container.is_sealed, isinstance(container.get(LateHandler), LateHandler))
    finally:
        kept.close()
