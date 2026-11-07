from tests.stories.core.support.fixtures import UserJoined

SKIP = "--skip-guard chat.declared-type"
CHAT_MARK_LINE = "chat-mark make --environment main memories.memory weighed"


def test_a_process_mark_is_made_shown_and_edited_while_it_is_shown(new_story):
    story = new_story(fixture=UserJoined)
    mark_id = story.new_row_id(f"{CHAT_MARK_LINE} run:1 Weighed {SKIP}")
    story.expect_success(f"chat-mark show {mark_id}", "state: shown")
    story.expect_success(f"chat-mark edit {mark_id} --text Later {SKIP}", "text: Later")


def test_ending_a_process_mark_sets_when_it_ended_and_closes_it_to_edits(new_story):
    story = new_story(fixture=UserJoined)
    mark_id = story.new_row_id(f"{CHAT_MARK_LINE} run:1 Weighed {SKIP}")
    story.expect_success(f"chat-mark end {mark_id}", "state: ended")
    story.expect_refusal(f"chat-mark edit {mark_id} --text Again {SKIP}", "is ended, so it cannot be edited")


def test_a_moment_mark_is_made_ended(new_story):
    story = new_story(fixture=UserJoined)
    mark_id = story.new_row_id(f"{CHAT_MARK_LINE} moment:1 Weighed --state ended {SKIP}")
    story.expect_success(f"chat-mark show {mark_id}", "state: ended")


def test_an_ended_mark_cannot_be_ended_again(new_story):
    story = new_story(fixture=UserJoined)
    mark_id = story.new_row_id(f"{CHAT_MARK_LINE} moment:1 Weighed --state ended {SKIP}")
    story.expect_refusal(f"chat-mark end {mark_id}", "is ended")


def test_a_key_is_used_once_in_an_environment(new_story):
    story = new_story(fixture=UserJoined)
    story.new_row_id(f"{CHAT_MARK_LINE} run:1 Weighed {SKIP}")
    story.expect_refusal(f"{CHAT_MARK_LINE} run:1 Weighed {SKIP}", "exists already")

