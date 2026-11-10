from engine.driver.tool_type import ToolType
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.secrets.support.private_home import REPLACEMENT_VALUE, VALUE, filled_story, private_folder
from tests.stories.core.support.coding_fixtures import BuilderStarted

__all__ = ["private_folder"]

FOLDER_REFUSAL = "the secrets folder is out of reach: run a program with a secret through the secret command"


def read_sample(path: str):
    return HookSamples.sample("pre_tool_use", {"name": "Read", "category": ToolType.READ, "files": [path], "diff": None})


def test_a_tool_that_reads_a_file_in_the_secrets_folder_is_refused(new_story, private_folder):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_refusal("s-1", read_sample(str(private_folder / "project.env")), FOLDER_REFUSAL)


def test_a_row_write_holding_a_replaced_value_is_refused_too(new_story):
    story = filled_story(new_story, f"secret fill 1 key {REPLACEMENT_VALUE}")
    story.expect_refusal(f'message send "the old key was {VALUE}" --environment main', "a row may not hold the value of", actor=story.agent)


def test_a_shown_field_such_as_a_username_is_no_secret_and_may_be_written(new_story):
    story = filled_story(new_story, 'secret make "AWS console" --type login', "secret fill 2 username ada.lovelace")
    story.expect_success('message send "log in as ada.lovelace" --environment main', actor=story.agent)
