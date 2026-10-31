from tests.stories.core.upgrade.support.fixture_upgrade import upgraded_story


def test_a_message_keeps_its_number_text_and_type(new_story):
    story = upgraded_story(new_story)
    story.expect_success("message show 1", "text: Ship the cart today", "type: user")
    story.expect_success("message show 2", "text: Shipping it", "type: agent")


def test_a_reply_names_the_message_it_answers(new_story):
    story = upgraded_story(new_story)
    story.expect_success("message show 2", "parent_id: 1")
