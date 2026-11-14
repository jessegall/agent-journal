from engine.registry.registry import Registry
from tests.stories.core.support.fixtures import UserJoined

AVATAR = "messages.avatar"
WITH_AVATAR = "viewer-layout save --suite coding --page home --layout '{\"windows\": [\"messages.chat\", \"messages.avatar\"]}' --environment main"
WITHOUT_AVATAR = "viewer-layout save --suite coding --page home --layout '{\"windows\": [\"messages.chat\"]}' --environment main"


def test_a_person_adds_the_avatar_window_to_the_home_page_and_removes_it_again(new_story):
    story = new_story(fixture=UserJoined)
    window = story.container.get(Registry).window(AVATAR)
    assert window.title == "Avatar"
    assert {key.name for key in window.keys} >= {"voice-profile", "voice-avatar", "voice-avatar-shown", "tool"}
    story.expect_success(WITH_AVATAR, actor=story.user)
    story.expect_success("viewer-layout current --suite coding --page home --environment main", "messages.avatar", actor=story.user)
    story.expect_success(WITHOUT_AVATAR, actor=story.user)
    story.expect_absent("viewer-layout current --suite coding --page home --environment main", "messages.avatar", actor=story.user)
