import sqlite3

from engine.database.database import Database
from engine.container.journal_container import synced_container
from engine.query.queries import Queries
from core.modules.messages.models.message import Message
from core.testing.expect_row import expect_row
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value

NOTE = 'message send "only in this story" --environment main'


def journal_file(story):
    return story.home.database.resolve()


def test_stories_one_after_the_other_share_one_journal_and_nothing_is_left_behind(templates, tmp_path):
    first = templates.story(tmp_path / "one", (), UserJoined)
    first.run(NOTE, actor=first.user)
    used_file = journal_file(first)
    first.close()
    second = templates.story(tmp_path / "two", (), UserJoined)
    second.expect_absent("message list --environment main", "only in this story", actor=second.user)
    expect_value(journal_file(second), used_file)
    second.close()


def test_stories_at_the_same_time_do_not_see_each_other(templates, tmp_path):
    first = templates.story(tmp_path / "one", (), UserJoined)
    second = templates.story(tmp_path / "two", (), UserJoined)
    first.run(NOTE, actor=first.user)
    second.expect_absent("message list --environment main", "only in this story", actor=second.user)
    expect_value(journal_file(first) != journal_file(second), True)
    first.close()
    second.close()


def test_a_second_connection_sees_what_the_story_wrote(templates, tmp_path):
    story = templates.story(tmp_path / "one", (), UserJoined)
    story.run(NOTE, actor=story.user)
    container = synced_container(story.home)
    database = container.get(Database)
    count = container.get(Queries).query(Message).filter(text="only in this story").count()
    database.close()
    story.close()
    expect_value(count, 1)


def test_a_checkpoint_that_reaches_the_file_is_undone_for_the_next_story(templates, tmp_path):
    story = templates.story(tmp_path / "one", (), UserJoined)
    story.run(NOTE, actor=story.user)
    connection = sqlite3.connect(story.home.database)
    connection.execute("PRAGMA wal_checkpoint(TRUNCATE)")
    connection.close()
    story.close()
    next_story = templates.story(tmp_path / "two", (), UserJoined)
    next_story.expect_absent("message list --environment main", "only in this story", actor=next_story.user)
    next_story.close()


def test_a_connection_left_open_does_not_reach_the_next_story(templates, tmp_path):
    story = templates.story(tmp_path / "one", (), UserJoined)
    story.run(NOTE, actor=story.user)
    database = synced_container(story.home).get(Database)
    used_file = journal_file(story)
    story.close()
    next_story = templates.story(tmp_path / "two", (), UserJoined)
    next_story.expect_absent("message list --environment main", "only in this story", actor=next_story.user)
    expect_value(journal_file(next_story), used_file)
    next_story.close()
    database.close()


def test_the_template_itself_stays_as_it_was(templates, tmp_path):
    template = templates.template((), UserJoined)
    template_bytes = template.home.database.read_bytes()
    story = templates.story(tmp_path / "one", (), UserJoined)
    story.run(NOTE, actor=story.user)
    story.close()
    expect_row(template, home=template.home)
    expect_value(template.home.database.read_bytes() == template_bytes, True)
