from core.modules.developer.support.recent_messages import RecentMessages


def test_a_remembered_message_is_contained_and_another_is_not():
    messages = RecentMessages()
    messages.remember("failure 1")
    assert messages.contains("failure 1") and not messages.contains("failure 2")


def test_past_its_limit_the_oldest_message_is_forgotten_and_the_newest_stay():
    messages = RecentMessages(limit=3)
    for number in range(4):
        messages.remember(f"failure {number}")
    assert not messages.contains("failure 0")
    assert all(messages.contains(f"failure {number}") for number in range(1, 4))
    assert len(messages.messages) == 3
