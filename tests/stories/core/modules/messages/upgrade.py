from tests.stories.core.upgrade.support.fixture_upgrade import upgraded_story


def test_a_message_keeps_its_number_text_and_type(new_story):
    story = upgraded_story(new_story)
    story.expect_success("message show 1", "text: Ship the cart today", "type: user")
    story.expect_success("message show 2", "text: Shipping it", "type: agent")


def test_a_reply_names_the_message_it_answers(new_story):
    story = upgraded_story(new_story)
    story.expect_success("message show 2", "parent_id: 1")


def test_a_chat_card_and_a_report_are_not_messages_and_are_counted_by_kind(new_story):
    story = upgraded_story(new_story)
    assert "Task 1 started" not in story.run("message list").output_text and "A report" not in story.run("message list").output_text
    assert "dropped chat card report: 1 rows" in story.upgrade_text and "chat card task_card" not in story.upgrade_text


def test_a_card_of_a_kind_whose_module_declares_a_mark_type_moves_as_an_ended_chat_mark(new_story):
    story = upgraded_story(new_story)
    listing = story.run("chat-mark list --environment 1").output_text
    assert "Task 1 started" in listing and "tasks.task" in listing
    story.expect_success("chat-mark show 1", "state: ended", "key: version-4:3")


def test_an_agents_message_names_the_agent_that_wrote_it(new_story):
    story = upgraded_story(new_story)
    agent = next(line.split()[0] for line in story.run("agent list").output_text.splitlines() if "s-1" in line)
    story.expect_success("message show 2", f"agent_id: {agent}")
