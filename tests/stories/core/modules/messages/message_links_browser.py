from engine.command.bus import Bus
from core.modules.documents.commands.record_subject_link.record_subject_link import RecordSubjectLink
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story

LONG_TEXT = "This message runs over several lines of the chat, so its words are spread out evenly and the bubble stays as wide as its longest line and no wider than that, with some more words after them."


def test_one_link_shows_below_the_time_and_four_group_into_a_chip_that_opens_a_list(new_story, tmp_path):
    story = new_story(fixture=UserJoined)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    for number in range(1, 5):
        story.expect_success(f'task make "Task number {number}" --brief "Sample" --environment main')
    single_message = story.new_row_id('message send "One link here" --environment main', actor=story.user)
    grouped_message = story.new_row_id('message send "Four links here" --environment main', actor=story.user)
    phone_message = story.new_row_id('message send "Three links here" --environment main', actor=story.user)
    story.run(f'message send "{LONG_TEXT}" --environment main', actor=story.user)
    bus = story.container.get(Bus)
    for message, tasks in ((single_message, [1]), (grouped_message, [1, 2, 3, 4]), (phone_message, [1, 2, 3])):
        for task in tasks:
            bus.run(RecordSubjectLink(message, "task", task), story.user, environment_id=1)
    with server_story(story) as server:
        expect_browser(server, "messageLinks.browser.mjs", [str(tmp_path / "message-links.png")])
