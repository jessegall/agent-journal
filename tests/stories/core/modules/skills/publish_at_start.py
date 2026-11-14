from engine.event.event_log import EventLog
from server.work.booting_work import BootingWork
from tests.stories.core.modules.plugins.hooks import installed_story
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_absent_exists_parent_stale, expect_changed_with, expect_file_2


def skill_file(story, folder):
    return story.home.folder.parent / ".claude" / "skills" / folder / "SKILL.md"


def test_a_start_logs_journal_booting(new_story):
    story = new_story(fixture=BuilderStarted)
    newest_event_id = story.container.get(EventLog).newest_id()
    BootingWork().run(story.container)
    story.run_listeners()
    expect_recent_event(story, newest_event_id, "journal.booting")


def test_a_start_writes_a_declared_skill_that_is_missing(new_story):
    story = new_story(fixture=BuilderStarted)
    skill_file(story, "journal-messages").unlink(missing_ok=True)
    BootingWork().run(story.container)
    story.run_listeners()
    expect_file_skill(story, "journal-messages")


def test_a_start_replaces_a_skill_whose_text_went_stale(new_story):
    story = new_story(fixture=BuilderStarted)
    stale_file = skill_file(story, "journal-messages")
    stale_file.parent.mkdir(parents=True, exist_ok=True)
    stale_file.write_text("old words")
    BootingWork().run(story.container)
    story.run_listeners()
    expect_stale_file_without(stale_file, "old words")


def test_a_start_removes_a_journal_skill_no_module_declares(new_story):
    story = new_story(fixture=BuilderStarted)
    stale_file = skill_file(story, "journal-gone")
    stale_file.parent.mkdir(parents=True, exist_ok=True)
    stale_file.write_text("old words")
    BootingWork().run(story.container)
    story.run_listeners()
    expect_absent_exists_parent_stale(stale_file)


def test_a_start_leaves_a_skill_that_is_not_the_journals(new_story):
    story = new_story(fixture=BuilderStarted)
    agent_file = skill_file(story, "my-own-skill")
    agent_file.parent.mkdir(parents=True, exist_ok=True)
    agent_file.write_text("my words")
    BootingWork().run(story.container)
    story.run_listeners()
    expect_file_2(agent_file, "my words")


def test_a_start_republishes_the_skills_of_a_plugin_that_is_on(new_story):
    story = installed_story(new_story)
    stale_file = skill_file(story, "sample-rules")
    stale_file.write_text("old words")
    BootingWork().run(story.container)
    story.run_listeners()
    expect_changed_with(stale_file, "plugin: sample")


def test_a_start_does_not_bring_back_the_skills_of_a_plugin_that_is_off(new_story):
    story = installed_story(new_story)
    story.run("plugin disable sample", actor=story.user)
    BootingWork().run(story.container)
    story.run_listeners()
    expect_absent_exists_skill_file(story, "sample-rules")


def expect_absent_exists_skill_file(story, text) -> None:
    actual = skill_file(story, text).exists()
    assert not actual, actual


def expect_stale_file_without(stale_file, expected) -> None:
    actual = stale_file.read_text()
    assert expected not in actual, actual


def expect_file_skill(story, text) -> None:
    actual = skill_file(story, text).is_file()
    assert actual, actual


def expect_recent_event(story, newest_event_id, expected) -> None:
    actual = [event.event for event in story.container.get(EventLog).events_after(newest_event_id)]
    assert expected in actual, actual
