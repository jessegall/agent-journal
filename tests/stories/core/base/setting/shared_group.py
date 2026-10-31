from core.base.module.module_removal import ModuleRemoval
from tests.stories.core.base.setting.support.setting_samples import PATH
from tests.stories.core.support.fixtures import UserJoined

OWN_ADDRESS = "good.sharing.tunnel.address"
PLACED_ADDRESS = "remote.access.tunnel.address"
TUNNEL = "https://tunnel.example.org"


def shared_story(new_story):
    story = new_story(f"{PATH}:GoodModule", fixture=UserJoined)
    story.synced_with(f"{PATH}:RemoteModule")
    return story


def test_the_tree_shows_a_group_in_the_module_that_places_it_and_in_its_own(new_story):
    story = shared_story(new_story)
    shown = story.run("setting tree", actor=story.user).output_text
    assert shown.count(OWN_ADDRESS) == 2, shown
    story.expect_ordered_lines("setting tree", "remote.access", "good.sharing.tunnel", OWN_ADDRESS, actor=story.user)


def test_a_value_saved_through_the_place_shows_in_the_owners_group_with_one_key(new_story):
    story = shared_story(new_story)
    story.run(f"setting set {PLACED_ADDRESS} {TUNNEL} --project", actor=story.user)
    story.expect_success(f"setting show {OWN_ADDRESS}", f"value: {TUNNEL}", "from: project", actor=story.user)
    story.expect_success(f"setting show {PLACED_ADDRESS}", f"key: {OWN_ADDRESS}", f"value: {TUNNEL}", actor=story.user)
    story.expect_text("setting list", OWN_ADDRESS)
    assert PLACED_ADDRESS not in story.run("setting list", actor=story.user).output_text


def test_a_value_saved_in_the_owners_group_shows_where_the_group_is_placed(new_story):
    story = shared_story(new_story)
    story.run(f"setting set {OWN_ADDRESS} {TUNNEL} --project", actor=story.user)
    story.expect_success(f"setting show {PLACED_ADDRESS}", f"value: {TUNNEL}", actor=story.user)
    assert story.run("setting tree", actor=story.user).output_text.count(TUNNEL) == 2


def test_a_reference_to_a_group_its_module_does_not_declare_is_refused_naming_the_module(new_story):
    story = new_story(f"{PATH}:GoodModule", fixture=UserJoined)
    story.expect_sync_refusal(f"{PATH}:DanglingModule", "dangling places good.sharing.nothing, which the module good does not declare")


def test_a_reference_that_leads_back_to_its_own_group_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_sync_refusal(f"{PATH}:LoopModule", "loop.again places loop.again, which holds it")


def test_a_sync_keeps_working_when_the_module_that_owns_a_placed_group_is_removed(new_story):
    story = shared_story(new_story)
    story.container.get(ModuleRemoval).remove("good")
    code, report = story.synced()
    assert code == 0, report
    assert OWN_ADDRESS not in story.run("setting tree", actor=story.user).output_text
