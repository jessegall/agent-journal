from core.base.change.event_log import EventLog
from server.booting_work import BootingWork
from tests.stories.core.modules.plugins.hooks import installed_story
from tests.stories.core.support.coding_fixtures import BuilderStarted


def skill_file(story, folder):
    return story.home.folder.parent / ".claude" / "skills" / folder / "SKILL.md"


def test_a_start_logs_journal_booting(new_story):
    story = new_story(fixture=BuilderStarted)
    newest_event_id = story.container.get(EventLog).newest_id()
    BootingWork().run(story.container)
    story.run_listeners()
    assert "journal.booting" in [event.event for event in story.container.get(EventLog).events_past(newest_event_id)]


def test_a_start_writes_a_declared_skill_that_is_missing(new_story):
    story = new_story(fixture=BuilderStarted)
    skill_file(story, "journal-messages").unlink(missing_ok=True)
    BootingWork().run(story.container)
    story.run_listeners()
    assert skill_file(story, "journal-messages").is_file()


def test_a_start_replaces_a_skill_whose_text_went_stale(new_story):
    story = new_story(fixture=BuilderStarted)
    stale_file = skill_file(story, "journal-messages")
    stale_file.parent.mkdir(parents=True, exist_ok=True)
    stale_file.write_text("old words")
    BootingWork().run(story.container)
    story.run_listeners()
    assert "old words" not in stale_file.read_text()


def test_a_start_removes_a_journal_skill_no_module_declares(new_story):
    story = new_story(fixture=BuilderStarted)
    stale_file = skill_file(story, "journal-gone")
    stale_file.parent.mkdir(parents=True, exist_ok=True)
    stale_file.write_text("old words")
    BootingWork().run(story.container)
    story.run_listeners()
    assert not stale_file.parent.exists()


def test_a_start_leaves_a_skill_that_is_not_the_journals(new_story):
    story = new_story(fixture=BuilderStarted)
    own_file = skill_file(story, "my-own-skill")
    own_file.parent.mkdir(parents=True, exist_ok=True)
    own_file.write_text("my words")
    BootingWork().run(story.container)
    story.run_listeners()
    assert own_file.read_text() == "my words"


def test_a_start_republishes_the_skills_of_a_plugin_that_is_on(new_story):
    story = installed_story(new_story)
    stale_file = skill_file(story, "sample-rules")
    stale_file.write_text("old words")
    BootingWork().run(story.container)
    story.run_listeners()
    assert "plugin: sample" in stale_file.read_text()


def test_a_start_does_not_bring_back_the_skills_of_a_plugin_that_is_off(new_story):
    story = installed_story(new_story)
    story.run("plugin disable sample", actor=story.user)
    BootingWork().run(story.container)
    story.run_listeners()
    assert not skill_file(story, "sample-rules").exists()
