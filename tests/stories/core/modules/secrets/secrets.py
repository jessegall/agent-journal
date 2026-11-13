import stat

from tests.stories.core.modules.secrets.support.private_home import REPLACEMENT_VALUE, VALUE, filled_story, private_folder, values_text
from tests.stories.core.modules.secrets.support.secret_fixtures import SecretMade
from tests.stories.core.support.fixtures import UserJoined

__all__ = ["private_folder"]


def made_story(new_story):
    return new_story(fixture=SecretMade)


def test_a_secret_is_made_empty_with_its_field_waiting_for_the_user(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('secret make "Github" --environment main', "secret 1 made: Github, waiting for the user to fill key on the Secrets window", actor=story.agent)
    story.expect_text("secret show 1", "secret 1: Github (api key)", "key  GITHUB_KEY  waiting for the user, hidden", "given to: no program yet", actor=story.agent)


def test_a_login_has_a_shown_username_and_a_hidden_password(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('secret make "AWS console" --type login', actor=story.agent)
    story.expect_text("secret show 1", "username  AWS_CONSOLE_USERNAME  waiting for the user\n", "password  AWS_CONSOLE_PASSWORD  waiting for the user, hidden",
                      actor=story.agent)


def test_a_custom_secret_has_the_fields_it_names_and_one_without_fields_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('secret make "Deploy" --type custom', "a custom secret needs at least one field: --field <name>, once for each", actor=story.agent)
    story.expect_success('secret make "Deploy" --type custom --field token --field host', actor=story.agent)
    story.expect_text("secret show 1", "token  DEPLOY_TOKEN  waiting for the user, hidden", "host  DEPLOY_HOST  waiting for the user, hidden", actor=story.agent)


def test_a_field_named_twice_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('secret make "Stripe" --field key', "this secret repeats a field: key, key", actor=story.agent)


def test_a_request_makes_the_secret_and_asks_the_user_in_the_chat_to_fill_it_on_the_secrets_window(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('secret request "Stripe" --why "to refund order 12" --environment main', "secret 1 asked for: the user fills it on the Secrets window",
                         actor=story.agent)
    story.expect_text("message show 1", "Please fill in the secret Stripe on the Secrets window, never in the chat: I need it to refund order 12.", actor=story.user)


def test_an_update_changes_the_title_and_how_it_is_used(new_story):
    story = made_story(new_story)
    story.expect_success('secret update 1 --title "GitHub" --brief "gh api user"', "secret 1 updated: GitHub", actor=story.agent)
    story.expect_text("secret show 1", "secret 1: GitHub (api key)", "gh api user", actor=story.agent)


def test_only_the_user_fills_a_value_and_the_agent_is_told_how_to_ask(new_story):
    story = made_story(new_story)
    story.expect_refusal(f"secret fill 1 key {VALUE}", "credential values are entered by a user in the Secrets window", actor=story.agent)


def test_a_filled_value_lives_only_in_the_values_file_outside_the_project_readable_by_its_user_alone(new_story, private_folder):
    story = filled_story(new_story)
    story.expect_text("secret show 1", "key  GITHUB_KEY  filled, hidden", actor=story.agent)
    values_file = next(private_folder.glob("*.env"))
    story.expect_rows(VALUE in values_text(private_folder), stat.S_IMODE(values_file.stat().st_mode) == 0o600,
                      VALUE.encode() not in story.home.database.read_bytes(), not values_file.resolve().is_relative_to(story.home.folder.resolve()))


def test_a_field_the_secret_lacks_is_refused_with_its_fields(new_story):
    story = made_story(new_story)
    story.expect_refusal(f"secret fill 1 token {VALUE}", "secret 1 has no field token: its fields are key", actor=story.user)


def test_a_value_the_agent_made_is_stored_from_its_file_which_is_deleted(new_story, private_folder, tmp_path):
    story = made_story(new_story)
    made = tmp_path / "password.txt"
    made.write_text(f"{VALUE}\n")
    story.expect_success(f"secret store 1 key {made}", f"key of secret 1 stored, and {made} deleted", actor=story.agent)
    story.expect_text("secret show 1", "key  GITHUB_KEY  filled, hidden", actor=story.agent)
    story.expect_rows(not made.exists(), VALUE in values_text(private_folder))


def test_a_store_from_a_missing_or_empty_file_is_refused_and_an_empty_file_is_deleted_all_the_same(new_story, tmp_path):
    story = made_story(new_story)
    story.expect_refusal(f"secret store 1 key {tmp_path / 'none.txt'}", "no file at", actor=story.agent)
    empty = tmp_path / "empty.txt"
    empty.write_text("\n")
    story.expect_refusal(f"secret store 1 key {empty}", "held no value; it is deleted all the same", actor=story.agent)
    story.expect_rows(not empty.exists())


def test_the_list_names_each_secret_what_it_waits_for_and_the_programs_it_goes_to(new_story):
    story = made_story(new_story)
    story.expect_success('secret make "AWS console" --type login', actor=story.agent)
    story.expect_success("secret allow 1 head", actor=story.user)
    story.expect_text("secret list", "1  api key  Github  waiting for the user  given to head", "2  login  AWS console  waiting for the user", actor=story.agent)


def test_the_agent_proposes_a_program_and_the_user_allows_it(new_story):
    story = made_story(new_story)
    story.expect_success("secret propose 1 curl", "curl proposed for secret 1: a user was asked in the dock", actor=story.agent)
    story.expect_success("secret propose 1 curl", "curl is proposed for secret 1 already", actor=story.agent)
    story.expect_text("secret show 1", "given to: no program yet; proposed: curl", actor=story.agent)
    story.expect_success("secret allow 1 curl", "secret 1 may go to curl", actor=story.user)
    story.expect_text("secret show 1", "given to: curl", actor=story.agent)
    story.expect_absent("secret show 1", "given to: curl; proposed: curl", actor=story.agent)


def test_a_wrapper_or_a_program_named_by_its_path_is_never_proposed(new_story):
    story = made_story(new_story)
    story.expect_refusal("secret propose 1 bash", "a secret never goes to bash: propose the program that uses it, named bare, such as curl or gh", actor=story.agent)
    story.expect_refusal("secret propose 1 /usr/bin/curl", "a secret never goes to /usr/bin/curl", actor=story.agent)
    story.expect_refusal("secret allow 1 python3", "a secret never goes to python3", actor=story.user)


def test_only_the_user_allows_a_program(new_story):
    story = made_story(new_story)
    story.expect_refusal("secret allow 1 curl --reason needed", "A user was asked in the dock", actor=story.agent)


def test_a_deleted_secret_leaves_the_list_and_comes_back_with_its_value_on_a_restore(new_story, private_folder):
    story = filled_story(new_story)
    story.expect_success("secret delete 1", "secret 1 deleted; journal secret restore 1 brings it back with its values", actor=story.agent)
    story.expect_absent("secret list", "1  api key  Github  given to head, printenv, tr", actor=story.agent)
    story.expect_text("secret show 1", "secret 1: Github (api key), deleted", actor=story.agent)
    story.expect_success("secret restore 1", "secret 1 restored", actor=story.agent)
    story.expect_text("secret list", "1  api key  Github  given to head, printenv, tr", actor=story.agent)
    story.expect_rows(VALUE in values_text(private_folder))
