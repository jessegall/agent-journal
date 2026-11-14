from core.modules.developer.support.recent_messages import RecentMessages


def test_a_remembered_message_is_contained():
    recent = RecentMessages()
    recent.remember("the round failed")
    assert recent.contains("the round failed")
    assert not recent.contains("another message")


def test_the_oldest_message_is_forgotten_past_the_limit():
    recent = RecentMessages(limit=2)
    for message in ("first", "second", "third"):
        recent.remember(message)
    assert not recent.contains("first")
    assert recent.contains("second") and recent.contains("third")
