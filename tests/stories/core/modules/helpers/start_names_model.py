import shlex

from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.modules.helpers.support.helper_nudges import START_WITHOUT_MODEL
from engine.testing.expectations.expect_nudge import said

REFUSAL = said(START_WITHOUT_MODEL)


def journal_line(command: str):
    return HookSamples.shell(f"journal {command}", ShellPart("journal", CommandCategory.JOURNAL, shlex.split(command), subcommand=command.split()[0]))


def test_a_helper_start_or_worker_dispatch_without_a_model_is_refused_and_one_naming_a_model_or_default_goes_on(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_refusal("s-1", journal_line('helper start journal-researcher --brief "Read the cart"'), REFUSAL)
    story.expect_hook_refusal("s-1", journal_line("worker dispatch 1"), REFUSAL)
    story.expect_hook_allowed("s-1", journal_line('helper start journal-researcher --brief "Read the cart" --model default'))
    story.expect_hook_allowed("s-1", journal_line("worker dispatch 1 --model sonnet"))
