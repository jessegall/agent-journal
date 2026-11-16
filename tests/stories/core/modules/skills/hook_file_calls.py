from engine.enums.command_category import CommandCategory
from engine.file.file_tally import FileTally
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderStarted

HOOK_FILE_CALL_LIMIT_COUNT = 200
LISTING = HookSamples.shell("journal plan list", ShellPart("journal", CommandCategory.JOURNAL, ["plan", "list"], subcommand="plan"))


def test_a_tool_hook_checks_neither_every_skill_file_nor_the_private_folder_again_for_each_row(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run("skill write")
    story.hook("s-1", LISTING)
    with FileTally.counting() as calls:
        story.hook("s-1", LISTING)
    sites = {origin: count for origin, count in calls.origins.items() if "skill_catalogue" in origin or "private_folder" in origin}
    story.expect_rows(calls.total < HOOK_FILE_CALL_LIMIT_COUNT, sum(sites.values()) <= 10, detail=f"{calls.total} calls, {sites}")
