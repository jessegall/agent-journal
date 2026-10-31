from tests.stories.core.base.setting.support.setting_samples import PATH
from tests.stories.core.support.fixtures import UserJoined

ADDRESS = "good.sharing.tunnel.address"
TOKEN = "good.sharing.tunnel.token"
SECRET_TEXT = "tok-4f9e2c"


def settings_story(new_story):
    return new_story(f"{PATH}:GoodModule", fixture=UserJoined)


def test_a_key_no_module_declares_is_refused(new_story):
    story = settings_story(new_story)
    story.expect_refusal("setting set good.nothing 3", "no module declares the setting good.nothing", actor=story.user)


def test_a_value_of_the_wrong_type_is_refused(new_story):
    story = settings_story(new_story)
    story.expect_refusal("setting set good.limit many", "good.limit is a number, not 'many'", actor=story.user)


def test_a_project_setting_set_for_an_environment_is_refused_with_the_flag_to_use(new_story):
    story = settings_story(new_story)
    story.expect_refusal(f"setting set {ADDRESS} https://tunnel.example.org --environment main", f"{ADDRESS} is set for the whole project", actor=story.user)
    story.expect_success(f"setting set {ADDRESS} https://tunnel.example.org --project", actor=story.user)


def test_an_agent_is_refused_a_setting_only_the_user_sets_and_may_set_its_own(new_story):
    story = settings_story(new_story)
    story.expect_refusal(f"setting set {ADDRESS} https://tunnel.example.org --project", f"ask the user to set {ADDRESS}", actor=story.agent)
    story.expect_success("setting set good.limit 70 --environment main", actor=story.agent)


def test_a_value_is_read_from_the_environment_then_the_project_then_its_default(new_story):
    story = settings_story(new_story)
    story.expect_success("setting show good.limit --environment main", "value: 50", "from: default", actor=story.user)
    story.run("setting set good.limit 60 --project", actor=story.user)
    story.expect_success("setting show good.limit --environment main", "value: 60", "from: project", actor=story.user)
    story.run("setting set good.limit 70 --environment main", actor=story.user)
    story.expect_success("setting show good.limit --environment main", "value: 70", "from: environment", actor=story.user)


def test_a_secret_is_shown_as_set_and_its_value_is_written_nowhere(new_story):
    story = settings_story(new_story)
    story.expect_success(f"setting show {TOKEN}", "value: not set", actor=story.user)
    story.run(f"setting set {TOKEN} {SECRET_TEXT} --project", actor=story.user)
    story.expect_success(f"setting show {TOKEN}", "value: set", actor=story.user)
    story.expect_rows(SECRET_TEXT not in story.run("setting tree", actor=story.user).output_text,
                      SECRET_TEXT not in story.run("event list --json", actor=story.user).output_text)


def test_a_toggleable_group_switched_off_turns_off_every_setting_inside_it(new_story):
    story = settings_story(new_story)
    story.run(f"setting set {ADDRESS} https://tunnel.example.org --project", actor=story.user)
    story.expect_success("setting switch good.sharing.tunnel off --project", actor=story.user)
    story.expect_success(f"setting show {ADDRESS}", "value: off", "from: group good.sharing.tunnel is off", actor=story.user)
    story.expect_success("setting switch good.sharing.tunnel on --project", actor=story.user)
    story.expect_success(f"setting show {ADDRESS}", "value: https://tunnel.example.org", actor=story.user)


def test_a_group_that_is_not_toggleable_cannot_be_switched_off(new_story):
    story = settings_story(new_story)
    story.expect_refusal("setting switch good.sharing off --project", "good.sharing cannot be switched off", actor=story.user)


def test_the_tree_lists_each_group_and_value_with_what_it_holds_now(new_story):
    story = settings_story(new_story)
    story.expect_ordered_lines("setting tree --environment main", "good.limit", "good.sharing", "good.sharing.tunnel", ADDRESS, TOKEN, actor=story.user)
