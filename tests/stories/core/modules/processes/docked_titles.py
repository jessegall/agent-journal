import json
import shlex
from datetime import timedelta

import pytest

from core.base.driver.command_category import CommandCategory
from core.base.driver.tool_type import ToolType
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.testing.expect_reply import expect_reply_line
from core.testing.expect_row import expect_row

CHAIN = "rm -rf /tmp/example && python3 - <<'PY'\nprint('private script')\nPY"
READ = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"])).with_fields(event="post_tool_use")
EDIT = HookSamples.sample("pre_tool_use", {"name": "Write", "category": ToolType.NEW_FILE, "files": ["cart.py"], "shell": None, "diff": None})


@pytest.fixture
def docked_chain(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = start_process(story, CHAIN, category=CommandCategory.BUILD)
    story.expect_success(f"dock add processes.output process {process.id} --environment main", actor=story.agent)
    return story, process


def test_a_chain_already_docked_requests_a_title_at_once_and_holds_after_five_tools(docked_chain):
    story, process = docked_chain
    reply = story.hook("s-1", READ)
    expect_reply_line(reply, f"journal output title {process.id}")
    for _ in range(5):
        story.advance(timedelta(seconds=1))
        story.hook("s-1", EDIT)
    story.advance(timedelta(seconds=1))
    story.expect_hook_refusal("s-1", EDIT, f"title output {process.id} is due")


def test_a_chain_card_has_a_short_title_from_its_first_part_without_its_script(docked_chain):
    story, process = docked_chain
    card = json.loads(story.run(f"process card {process.id} --json", actor=story.agent).output_text)
    expect_row(card, title="Removing files")
    story.expect_success(f'output title {process.id} "Removing temporary files"', actor=story.agent)
    titled = json.loads(story.run(f"process card {process.id} --json", actor=story.agent).output_text)
    expect_row(titled, title="Removing temporary files")


def test_a_reader_title_that_is_the_whole_chain_still_needs_a_name(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_success(f'reader add raw --commands "rm*" --lines "progress" --title {shlex.quote(CHAIN)}', actor=story.agent)
    process = start_process(story, CHAIN, category=CommandCategory.BUILD)
    story.expect_success(f"dock add processes.output process {process.id} --environment main", actor=story.agent)
    reply = story.hook("s-1", READ)
    expect_reply_line(reply, f"journal output title {process.id}")
    card = json.loads(story.run(f"process card {process.id} --json", actor=story.agent).output_text)
    expect_row(card, title="Removing files")
