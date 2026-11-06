import pytest

from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.modules.chat.models.chat_mark import ChatMark
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.plugins.support.event_stories import REFUSAL, SECOND_JOB, TASK_CREATED, event_page, event_plugin_story, install_event_plugin, logged_events
from tests.stories.core.modules.plugins.event_manifest import replace_module
from tests.stories.core.modules.plugins.support.event_modules import FORMER_NOTE_CREATED, NOTE_CREATED, NOTES, REMOVED_NOTES_MODULE
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent

AGENT_REFUSAL = "an agent may not use journal plugin run"
RUN_LINE = "plugin run -- journal plan approve 1"
OUTWARD = "reaches past the journal"
SKIP_REASON = '--skip-reason "the plugin is wrong here"'
SECOND_REFUSAL = "[plugin second] not today"


def test_s63_an_agent_is_refused_plugin_run(new_story):
    story = event_plugin_story(new_story)
    story.expect_refusal(RUN_LINE, AGENT_REFUSAL, actor=story.agent)
    story.expect_refusal(f"plugin run --agent {story.agent.id} -- journal plan approve 1", AGENT_REFUSAL, actor=story.agent)


@pytest.mark.parametrize("line", ["journal plugin run -- true", "journal plugin try events core.tasks.task.created"])
def test_s64_a_read_only_helper_cannot_start_a_script(new_story, line):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    sample = HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:]))
    story.expect_hook_refusal(helper.session, sample, OUTWARD)


@pytest.mark.parametrize("entry", [".", "", "../x", "a/../..", "link-out"])
def test_s65_a_wrong_project_read_is_on_the_card_and_never_opened(event_page, entry):
    story = event_page.story
    (story.home.project_folder / "link-out").symlink_to(story.home.folder.parent.parent, target_is_directory=True)
    install_event_plugin(story, project_reads=[entry])
    wrong = [row for row in event_page.card() if row["state"] == "wrong project read"]
    story.expect_rows([row["key"] for row in wrong] == [entry])


def test_s52_the_journal_folder_is_a_wrong_project_read_on_the_card(event_page):
    story = event_page.story
    (story.home.folder / "worktrees").mkdir(parents=True, exist_ok=True)
    install_event_plugin(story, project_reads=[story.home.folder.name, f"{story.home.folder.name}/worktrees"])
    story.expect_rows(sorted(row["state"] for row in event_page.card()) == ["wrong project read", "wrong project read"])


def test_s66_a_skip_names_one_plugin_and_the_other_still_refuses(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "refuse.sh"})
    install_event_plugin(story, {"event": TASK_CREATED, "guard": "refuse.sh"}, name="second")
    story.expect_refusal(SECOND_JOB, REFUSAL, actor=story.agent)
    story.expect_refusal(f"{SECOND_JOB} --skip-guard plugins.event-guard:events {SKIP_REASON}", SECOND_REFUSAL, actor=story.agent)
    story.expect_refusal(f"{SECOND_JOB} --skip-guard plugins.event-guard {SKIP_REASON}", "has no skip", actor=story.agent)
    story.expect_success(f"{SECOND_JOB} --skip-guard plugins.event-guard:events --skip-guard plugins.event-guard:second {SKIP_REASON}", actor=story.user)
    story.expect_rows("plugins.event-guard:events" in logged_events(story, "task.create")[-1].skipped_guards)


def test_s66_an_entry_with_skip_false_offers_no_skip_and_naming_it_passes_nothing(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "guard": "refuse.sh", "skip": False})
    outcome = story.run(SECOND_JOB, actor=story.agent)
    story.expect_rows(REFUSAL in outcome.output_text, "--skip-guard" not in outcome.output_text)
    story.expect_refusal(f"{SECOND_JOB} --skip-guard plugins.event-guard:events {SKIP_REASON}", REFUSAL, actor=story.agent)


def test_s68_a_removed_key_tells_the_chat_once(new_story):
    story = event_plugin_story(new_story, {"event": NOTE_CREATED, "guard": "see.sh"}, modules=[NOTES])
    replace_module(story, NOTES, REMOVED_NOTES_MODULE)
    story.run_listeners()
    marks = story.container.get(Queries).query(ChatMark).all_rows()
    matching_marks = [mark for mark in marks if "events" in mark.text and NOTE_CREATED in mark.text]
    story.expect_rows(len(matching_marks) == 1, "no longer runs" in matching_marks[0].text)
    code, text = story.synced()
    story.expect_rows(code == 0, len([mark for mark in story.container.get(Queries).query(ChatMark).all_rows() if NOTE_CREATED in mark.text]) == 1)


def test_s68_a_key_with_a_former_key_line_gives_no_mark(new_story):
    story = event_plugin_story(new_story, {"event": FORMER_NOTE_CREATED, "commit": "see.sh"}, modules=[NOTES])
    story.expect_rows(not [mark for mark in story.container.get(Queries).query(ChatMark).all_rows() if FORMER_NOTE_CREATED in mark.text])
