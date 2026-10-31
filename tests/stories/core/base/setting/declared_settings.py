from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.base.setting.support.setting_samples import PATH
from tests.stories.core.support.fixtures import MainEnvironment


def declared(story, module: str) -> dict[str, object]:
    return {entry.key: entry for entry in Registry.read(story.container.get(Database)).settings if entry.module == module}


def test_a_module_s_settings_are_registered_under_keys_its_name_prefixes(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:GoodModule")
    story.expect_rows(set(declared(story, "good")) == {"good.limit", "good.sharing", "good.sharing.tunnel", "good.sharing.tunnel.address", "good.sharing.tunnel.token"})


def test_a_nested_group_keeps_its_parent_and_whether_it_can_be_switched_off(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:GoodModule")
    tunnel = declared(story, "good")["good.sharing.tunnel"]
    story.expect_rows(tunnel.parent == "good.sharing", tunnel.toggleable)


def test_a_secret_is_registered_without_a_value(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:GoodModule")
    token = declared(story, "good")["good.sharing.tunnel.token"]
    story.expect_rows(token.secret, token.default is None)


def test_two_settings_with_one_key_are_refused(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:TwiceModule", "twice declares the setting twice.limit twice")


def test_a_default_that_is_not_of_its_type_is_refused(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:WrongDefaultModule", "the setting wrong.limit is a number, but its default is 'fifty'")


def test_a_group_with_nothing_in_it_is_refused(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:EmptyGroupModule", "the setting group empty.sharing holds no setting")


def test_a_title_over_40_characters_is_refused(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:LongTitleModule", "the title of long.limit is 46 characters; a title is at most 40")


def test_a_description_over_120_characters_is_refused(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:LongDescriptionModule", "the description of wordy.limit is 125 characters; a description is at most 120")


def test_a_secret_with_a_default_is_refused(new_story):
    new_story(fixture=MainEnvironment).expect_sync_refusal(f"{PATH}:SecretDefaultModule", "the secret leaky.token has a default; a secret is set by the person, never written in code")
