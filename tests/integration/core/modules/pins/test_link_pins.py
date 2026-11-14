from engine.testing.expectations.text_match import contains_text
import json
from unittest.mock import patch

from engine.database.database import Database
from engine.enums.command_category import CommandCategory
from engine.enums.tool_type import ToolType
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.fixtures import UserJoined
from tests.integration.core.modules.helpers.test_helper_jobs import StartedHelper, helper_agent
from tests.integration.core.modules.helpers.test_helper_reports import reported


def shell_call(line: str, output: str = ""):
    program = line.split()[0]
    category = CommandCategory.READ if program == "cat" else CommandCategory.PROCESS
    sample = HookSamples.shell(line, ShellPart(program, category, line.split()[1:])).with_fields(event="post_tool_use")
    return sample.with_raw({"tool_response": {"stdout": output}})






def pin_lines(hook_answer) -> list[str]:
    return [line for line in hook_answer.lines if contains_text(line, "pin this link")]


def with_shop_remote(story):
    config = story.home.project_folder / ".git" / "config"
    config.parent.mkdir(parents=True, exist_ok=True)
    config.write_text('[remote "origin"]\n\turl = https://github.com/shop/cart.git\n')
    return story


def as_worktree_with_an_included_alias_remote(story):
    """The project folder is a git worktree: its .git file points into the main checkout, whose config includes a
    file that names the remote through an ssh host alias."""
    common = story.home.project_folder.parent / "main-checkout" / ".git"
    pointed = common / "worktrees" / "project"
    pointed.mkdir(parents=True, exist_ok=True)
    (pointed / "commondir").write_text("../..\n")
    (common / "config").write_text('[core]\n\tbare = false\n[include]\n\tpath = remotes.conf\n')
    (common / "remotes.conf").write_text('[remote "origin"]\n\turl = git@github-work:shop/cart.git\n')
    (story.home.project_folder / ".git").write_text(f"gitdir: {pointed}\n")
    return story






















def expect_pin_lines(hook_answer) -> None:
    assert pin_lines(hook_answer)


def expect_absent_pin_lines(hook_answer) -> None:
    assert not pin_lines(hook_answer)


def expect_lines_hook_2(text, text_2, story, text_3, text_4, text_5) -> None:
    actual = any((contains_text(line, text) and text_2 in line for line in story.hook(text_3, shell_call(text_4, text_5)).lines))
    assert actual, actual


def test_a_link_in_the_command_and_output_is_checked_once(played):
    story = played(UserJoined)
    link = "https://docs.example.com/pages/4"
    database = story.container.get(Database)
    with patch.object(database, "rows", wraps=database.rows) as reads:
        expect_pin_lines(story.hook("s-1", shell_call(f"curl {link}", link)))
    pin_reads = [call for call in reads.call_args_list if "FROM pins WHERE closed_at IS NULL AND link IN" in call.args[0].sql and "count(*)" not in call.args[0].sql]
    story.expect_rows(len(pin_reads) == 1)
