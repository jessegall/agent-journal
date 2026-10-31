from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story


def test_each_module_that_moved_rows_logs_one_upgrade_moved_event_with_its_counts(new_story):
    story = upgraded_story(new_story)
    events = story.run("event list --json").output_text
    for module in ("journal.core.tasks", "journal.core.questions", "journal.core.memories"):
        assert events.count(f'"{module}"') >= 1, module
    assert "upgrade.moved" in events


def test_no_create_listener_runs_for_a_moved_row_so_history_announces_nothing(new_story):
    story = upgraded_story(new_story)
    story.run_listeners()
    marks = story.run("chat-mark list").output_text
    assert "Which database?" not in marks and "Ship on Friday?" not in marks
    story.expect_success("question show 2", "state: open")
    story.expect_success("review list", "nothing found")
