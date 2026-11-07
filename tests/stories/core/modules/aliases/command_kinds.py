import json

from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderStarted

UNKNOWN_RUN = HookSamples.shell("scripts/dev go test ./cli/judge/", ShellPart("scripts/dev", "unknown", ["go", "test", "./cli/judge/"]))


def test_a_command_of_unknown_kind_is_refused_until_the_agent_classifies_it(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_refusal("s-1", UNKNOWN_RUN, "scripts/dev is a command of unknown kind: classify its leading words first")
    story.expect_success('command-kind make "scripts/dev go test" "test run"', "category: test run", actor=story.agent)
    story.run_listeners()
    assert json.loads(story.home.command_kind_file.read_text()) == {"scripts/dev go test": "test run"}


def test_a_command_is_never_classified_as_unknown_or_as_a_journal_command(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_refusal('command-kind make "scripts/dev" unknown', "a command is not classified as unknown", actor=story.agent)
    story.expect_refusal('command-kind make "scripts/dev" journal', "a command is not classified as journal", actor=story.agent)
