from functools import partial

from tests.stories.engine.upgrade.support.fixture_upgrade import upgraded_story, expect_upgrade_text
from tests.stories.core.modules.secrets.support.private_home import private_folder
from tests.stories.fixtures.version_four import GITHUB_VALUE, with_private_values

__all__ = ["private_folder"]


def test_a_version_4_secret_keeps_its_number_fields_filled_fields_and_programs(new_story, private_folder):
    story = upgraded_story(new_story, partial(with_private_values, secrets_folder=private_folder))
    story.expect_text("secret show 1", "secret 1: Github (api key)", "gh api user", "key  GITHUB_KEY  filled, hidden", "given to: head; proposed: curl")
    story.expect_text("secret show 2", "username  AWS_CONSOLE_USERNAME  waiting for the user", "password  AWS_CONSOLE_PASSWORD  waiting for the user, hidden")


def test_a_moved_secret_runs_with_the_value_version_4_kept_masked_in_the_output(new_story, private_folder):
    story = upgraded_story(new_story, partial(with_private_values, secrets_folder=private_folder))
    outcome = story.run("secret run 1 -- head -c 64")
    story.expect_rows(outcome.code == 0, "[secret GITHUB_KEY]" in outcome.output_text, GITHUB_VALUE not in outcome.output_text)


def test_a_secret_deleted_in_version_4_is_not_moved_and_a_browser_login_waits_for_after_the_switch(new_story, private_folder):
    story = upgraded_story(new_story, partial(with_private_values, secrets_folder=private_folder))
    story.expect_refusal("secret show 3", "no secret 3")
    expect_upgrade_text(story, "skipped secrets 3: a deleted secret is erased, not moved")
    story.expect_refusal("secret show 4", "no secret 4")
    expect_upgrade_text(story, "skipped secrets 4: a browser login moves after the switch")
