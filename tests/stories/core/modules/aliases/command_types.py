import json

from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_value

UNKNOWN_RUN = HookSamples.shell("scripts/dev go test ./cli/judge/", ShellPart("scripts/dev", "unknown", ["go", "test", "./cli/judge/"]), has_saved_commands=True)


def test_a_command_of_unknown_type_is_refused_until_the_agent_classifies_it(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_refusal("s-1", UNKNOWN_RUN, "scripts/dev has an unknown command type: say what type the command is, process when no type fits")
    story.expect_success('command-type make "scripts/dev go test" "test run"', "category: test run", actor=story.agent)
    story.run_listeners()
    expect_value(json.loads(story.home.command_type_file.read_text()), {"scripts/dev go test": "test run"})


def test_a_command_is_never_classified_as_unknown_or_as_a_journal_command(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_refusal('command-type make "scripts/dev" unknown', "a command is not classified as unknown", actor=story.agent)
    story.expect_refusal('command-type make "scripts/dev" journal', "a command is not classified as journal", actor=story.agent)
