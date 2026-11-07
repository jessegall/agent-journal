from core.base.private.secret_values import SecretValues
from tests.stories.core.support.fixtures import UserJoined
from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.modules.secrets.support.private_home import REPLACEMENT_VALUE, VALUE, filled_story, private_folder

__all__ = ["private_folder"]

MASK = "[secret GITHUB_KEY]"


def test_the_value_goes_to_the_program_on_its_input_and_comes_back_masked(new_story):
    story = filled_story(new_story)
    story.expect_text("secret run 1 -- head -c 64", MASK, actor=story.agent)
    story.expect_absent("secret run 1 -- head -c 64", VALUE, actor=story.agent)


def test_env_gives_the_value_in_the_fields_variable_masked_in_the_output(new_story):
    story = filled_story(new_story)
    story.expect_text("secret run 1 --env -- printenv GITHUB_KEY", MASK, actor=story.agent)


def test_stdin_sends_the_text_with_the_field_filled_in(new_story):
    story = filled_story(new_story)
    story.expect_text('secret run 1 --stdin "Bearer {key}" -- head -c 64', f"Bearer {MASK}", actor=story.agent)


def test_a_replaced_value_is_still_masked(new_story):
    story = filled_story(new_story, f"secret fill 1 key {REPLACEMENT_VALUE}")
    outcome = story.run(f'secret run 1 --stdin "old {VALUE} new {{key}}" -- head -c 200', story.agent)
    story.expect_rows(outcome.code == 0, VALUE not in outcome.output_text, REPLACEMENT_VALUE not in outcome.output_text, outcome.output_text.count(MASK) == 2)


def test_a_secret_is_found_by_its_title_and_an_unknown_one_is_refused(new_story):
    story = filled_story(new_story)
    story.expect_text("secret run Github -- head -c 64", MASK, actor=story.agent)
    story.expect_refusal("secret run Nope -- head -c 64", "no secret is numbered or titled 'Nope': journal secret list shows them", actor=story.agent)


def test_the_program_runs_with_a_throwaway_home_and_nothing_of_the_agents_environment(new_story, monkeypatch, private_folder):
    story = filled_story(new_story)
    monkeypatch.setenv("LEAKED_NAME", "leaked-value")
    outcome = story.run("secret run 1 -- printenv", story.agent)
    home_lines = [line.removeprefix("HOME=") for line in outcome.output_text.splitlines() if line.startswith("HOME=")]
    story.expect_rows(outcome.code == 0, "LEAKED_NAME" not in outcome.output_text, len(home_lines) == 1, str(private_folder / "runs") in home_lines[0],
                      not any((private_folder / "runs").iterdir()))


def test_a_program_the_user_did_not_allow_is_refused_with_how_to_propose_it(new_story):
    story = filled_story(new_story)
    story.expect_refusal("secret run 1 -- curl https://api.github.com", "A person was asked in the dock", actor=story.agent)


def test_a_wrapper_is_refused_even_named_after_the_separator(new_story):
    story = filled_story(new_story)
    story.expect_refusal("secret run 1 -- bash -c true", "a secret never goes to bash: name the program that uses it, such as curl or gh", actor=story.agent)


def test_a_program_named_by_its_path_is_refused_with_its_bare_name(new_story):
    story = filled_story(new_story)
    story.expect_refusal("secret run 1 -- /usr/bin/head -c 8", "name the program bare, as head", actor=story.agent)


def test_a_run_without_a_program_is_refused_with_an_example(new_story):
    story = filled_story(new_story)
    story.expect_refusal("secret run 1", "name the program after --, such as journal secret run 1 -- gh api user", actor=story.agent)


def test_a_secret_without_its_value_is_refused_with_who_fills_it(new_story):
    story = filled_story(new_story, 'secret make "Stripe"', "secret allow 2 head")
    story.expect_refusal("secret run 2 -- head -c 8", "secret 2 has no value for key: the user fills it on the Secrets window", actor=story.agent)


def test_a_deleted_secret_is_refused_with_how_to_restore_it(new_story):
    story = filled_story(new_story, "secret delete 1")
    story.expect_refusal("secret run 1 -- head -c 8", "secret 1 is deleted: journal secret restore 1 brings it back", actor=story.agent)


def test_a_helper_is_refused_until_the_user_lets_helpers_have_the_secret(new_story):
    story = filled_story(new_story)
    worker = story.new_row_id(f"agent start s-2 claude worker --parent {story.agent.id} --environment main")
    helper = Actor(worker, ActorType.AGENT)
    story.expect_refusal("secret run 1 -- head -c 64", "A person was asked in the dock", actor=helper)
    story.expect_success("secret allow 1 --helpers", "helpers may use secret 1", actor=story.user)
    story.expect_text("secret run 1 -- head -c 64", MASK, actor=helper)


def test_a_program_that_fails_gives_its_output_and_its_exit_code(new_story):
    story = filled_story(new_story)
    story.expect_text("secret run 1 -- head -c 8 /no/such/file", "head ended with exit code 1", actor=story.agent)


def test_only_a_person_removes_a_field_and_its_value_stays_only_to_be_masked(new_story):
    story = filled_story(new_story)
    values = story.container.get(SecretValues)
    story.expect_refusal("secret update 1 --remove-field key", "only a person removes a field", actor=story.agent)
    story.expect_rows("GITHUB_KEY" in values.values())
    story.expect_success("secret update 1 --remove-field key", actor=story.user)
    story.expect_rows("GITHUB_KEY" not in values.values(), VALUE in values.hidden_values())


def test_a_shown_value_goes_with_its_field(new_story):
    story = filled_story(new_story)
    values = story.container.get(SecretValues)
    values.put("GITHUB_NAME", "ada", False, 1)
    values.retire("GITHUB_NAME", 2)
    story.expect_rows("ada" not in values.values().values(), "GITHUB_NAME" not in values.shown())


def test_a_secret_gains_and_loses_a_field_and_a_deleted_one_is_listed(new_story):
    story = new_story(fixture=UserJoined)
    story.run('secret make "Own" --type custom --field base', actor=story.user)
    story.run("secret update 1 --add-field region --add-field token", actor=story.user)
    story.expect_text("secret list --json", '"region"', '"token"', actor=story.user)
    story.run("secret update 1 --remove-field region", actor=story.user)
    text = story.run("secret list --json", actor=story.user)
    text.expect_no_text('"region"')
    text.expect_text('"token"')
    story.run("secret delete 1", actor=story.user)
    story.expect_text("secret list --deleted", "Own", actor=story.user)
    story.expect_absent("secret list", "Own", actor=story.user)
