from engine.module.module_removal import ModuleRemoval
from tests.stories.support.story_checks import expect_count_output, expect_count_shown, expect_value
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.engine.setting.support.setting_samples import PATH

LOCAL_ADDRESS = "good.sharing.tunnel.address"
PLACED_ADDRESS = "remote.access.tunnel.address"
TUNNEL = "https://tunnel.example.org"


def shared_story(new_story):
    story = new_story(f"{PATH}:GoodModule", fixture=UserJoined)
    story.synced_with(f"{PATH}:RemoteModule")
    return story


def expect_index_placed_less(placed, text, expected) -> None:
    actual = placed.index(text)
    assert actual < expected, actual


def test_a_reference_that_leads_back_to_its_own_group_is_refused(journal):
    journal.expect_sync_refusal(f"{PATH}:LoopModule", "loop places loop.again, which holds it")


LOCAL_ADDRESS = "good.sharing.tunnel.address"


PLACED_ADDRESS = "remote.access.tunnel.address"


TUNNEL = "https://tunnel.example.org"


def test_a_sync_keeps_working_when_the_module_that_owns_a_placed_group_is_removed(played):
    story = shared_story(played)
    story.container.get(ModuleRemoval).remove("good")
    code, report = story.synced()
    expect_value(code, 0)
    story.expect_no_text("setting tree", LOCAL_ADDRESS, actor=story.user)
