import json

from core.base.driver.command_category import CommandCategory
from core.modules.overview.support.overview_first import OverviewFirst
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.support.fixtures import UserJoined


def test_the_overview_shows_each_default_command_under_its_heading(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    text = story.run("overview", actor=story.user).output_text
    assert "## task list --state open" in text and "Fix the cart" in text
    assert "## question list" in text
    assert "has no" not in text and "journal failed" not in text and "unrecognized arguments" not in text
    assert "Fix the cart  " not in text.replace("Fix the cart\n", "")


def test_the_user_chooses_what_the_overview_shows(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('setting set journal.core.overview.commands "task board" --project', actor=story.user)
    answer = json.loads(story.run("overview --json", actor=story.user).output_text)
    assert [section["command"] for section in answer["sections"]] == ["task board"]
    story.expect_no_text("overview", "question list", actor=story.user)


def test_a_command_that_fails_shows_why_and_the_others_still_run(new_story):
    story = new_story(fixture=UserJoined)
    story.run('setting set journal.core.overview.commands "nothing here,task board" --project', actor=story.user)
    text = story.run("overview", actor=story.user)
    text.expect_text("## nothing here")
    text.expect_text("## task board")


OVERVIEW_HOOK = HookSamples.shell("journal overview", ShellPart("journal", CommandCategory.JOURNAL, ["overview"], subcommand="overview"))
JOURNAL_LINE = HookSamples.shell("journal task list", ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"], subcommand="task"))
LISTING = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"]))
EDIT = HookSamples.edit("src/cart.py")
RESUME = HookSamples.session_start().with_raw({"source": "resume"})
COMPACTION = HookSamples.session_start().with_raw({"source": "compact"})


def overview_story(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.container.bind(OverviewFirst, OverviewFirst())
    return story


def test_after_a_session_start_only_reading_and_journal_commands_go_before_the_overview(new_story):
    story = overview_story(new_story)
    story.hook("s-1", HookSamples.session_start())
    story.run_listeners()
    story.expect_hook_refusal("s-1", EDIT, "run journal overview first")
    story.expect_hook_allowed("s-1", LISTING)
    story.expect_hook_allowed("s-1", JOURNAL_LINE)
    story.expect_hook_refusal("s-1", EDIT, "run journal overview first")
    story.expect_hook_allowed("s-1", OVERVIEW_HOOK)
    story.expect_hook_allowed("s-1", EDIT)


def test_a_compaction_blocks_again_and_a_resume_does_not(new_story):
    story = overview_story(new_story)
    story.hook("s-1", HookSamples.session_start())
    story.hook("s-1", OVERVIEW_HOOK)
    story.hook("s-1", RESUME)
    story.expect_hook_allowed("s-1", EDIT)
    story.hook("s-1", COMPACTION)
    story.expect_hook_refusal("s-1", EDIT, "run journal overview first")
