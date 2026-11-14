from engine.viewer.person_lines import PERSON_LINES

MARKS = "chat-mark list --environment 1"
OLD_LAYOUT = "viewer-layout save --suite coding --page home --layout '{\"windows\": [\"agents.subagents\"]}' --environment main"
LAYOUT = "viewer-layout current --suite coding --page home --environment main"


def assert_person_line():
    assert "helper start" in PERSON_LINES


def test_helper_start_is_a_persons_line():
    assert_person_line()
