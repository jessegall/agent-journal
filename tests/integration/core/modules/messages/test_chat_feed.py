from core.modules.messages.messages_module import MessagesModule
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined


class TwoMessages(StoryFixture):
    """Two messages for feed paging."""

    parent = UserJoined

    def steps(self, story):
        story.run('message send "first" --environment main', actor=story.user)
        story.run('message send "second" --environment main', actor=story.user)


def test_the_chat_window_reads_both_paged_keys_by_ids():
    window = next(window for window in MessagesModule.window_declarations() if window.name == "messages.chat")
    keys = {key.name: key for key in window.keys}
    assert 'ids' in keys['messages'].arguments
    assert 'ids' in keys['marks'].arguments
    assert keys['messages'].listed()['reads_ids']
    assert keys['marks'].listed()['reads_ids']
