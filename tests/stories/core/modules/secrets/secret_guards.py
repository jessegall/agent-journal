from core.base.driver.command_category import CommandCategory
from core.base.driver.tool_type import ToolType
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.secrets.support.private_home import REPLACEMENT_VALUE, VALUE, filled_story, private_folder
from tests.stories.core.support.coding_fixtures import BuilderStarted

__all__ = ["private_folder"]

FOLDER_REFUSAL = "the secrets folder is out of reach: run a program with a secret through the secret command"


def read_sample(path: str):
    return HookSamples.sample("pre_tool_use", {"name": "Read", "category": ToolType.READ, "files": [path], "diff": None})


def shell_sample(line: str):
    program, *arguments = line.split()
    return HookSamples.shell(line, ShellPart(program, CommandCategory.READ, arguments))


def test_a_tool_that_reads_a_file_in_the_secrets_folder_is_refused(new_story, private_folder):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_refusal("s-1", read_sample(str(private_folder / "project.env")), FOLDER_REFUSAL)


def test_a_shell_line_naming_the_secrets_folder_by_another_spelling_is_refused(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_refusal("s-1", shell_sample("cat ~/.config/agent-journal/secrets/project.env"), FOLDER_REFUSAL)


def test_a_tool_naming_the_version_4_server_keys_folder_is_refused(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_refusal("s-1", shell_sample("ls ~/.journal/keys"), FOLDER_REFUSAL)


def test_a_tool_on_any_other_file_goes_on(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_allowed("s-1", read_sample("src/cart.py"))


def test_a_row_write_holding_a_secret_value_is_refused_with_the_variable_it_holds(new_story):
    story = filled_story(new_story)
    story.expect_refusal(f'message send "the key is {VALUE}" --environment main', "a row may not hold the value of GITHUB_KEY: name the secret, never its value",
                         actor=story.agent)


def test_a_row_write_holding_a_replaced_value_is_refused_too(new_story):
    story = filled_story(new_story, f"secret fill 1 key {REPLACEMENT_VALUE}")
    story.expect_refusal(f'message send "the old key was {VALUE}" --environment main', "a row may not hold the value of", actor=story.agent)


def test_a_shown_field_such_as_a_username_is_no_secret_and_may_be_written(new_story):
    story = filled_story(new_story, 'secret make "AWS console" --type login', "secret fill 2 username ada.lovelace")
    story.expect_success('message send "log in as ada.lovelace" --environment main', actor=story.agent)
