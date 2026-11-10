from tests.stories.engine.upgrade.support.fixture_upgrade import upgraded_story, expect_upgrade_text, expect_upgrade_without_text


def test_a_message_keeps_its_number_text_and_type(new_story):
    story = upgraded_story(new_story)
    story.expect_success("message show 1", "text: Ship the cart today", "type: user")
    story.expect_success("message show 2", "text: Shipping it", "type: agent")


def test_a_chat_card_and_a_report_are_not_messages_and_are_counted_by_kind(new_story):
    story = upgraded_story(new_story)
    story.expect_no_text("message list", "Task 1 started")
    story.expect_no_text("message list", "A report")
    expect_upgrade_text(story, "dropped chat card report: 1 rows")
    expect_upgrade_without_text(story, "chat card task_card")


def test_a_card_of_a_kind_whose_module_declares_a_mark_type_moves_as_an_ended_chat_mark(new_story):
    story = upgraded_story(new_story)
    listing = story.run("chat-mark list --environment 1")
    listing.expect_text("Task 1 started")
    listing.expect_text("tasks.task")
    story.expect_success("chat-mark show 1", "state: ended", "key: version-4:3")


def test_an_agents_message_names_the_agent_that_wrote_it(new_story):
    story = upgraded_story(new_story)
    agent = next(line.split()[0] for line in story.run("agent list").output_text.splitlines() if "s-1" in line)
    story.expect_success("message show 2", f"session_agent_id: {agent}")


def test_a_message_of_an_environment_that_no_longer_exists_is_skipped_and_told(new_story):
    story = upgraded_story(new_story)
    expect_upgrade_text(story, "skipped messages 5: its environment 9 did not move")
