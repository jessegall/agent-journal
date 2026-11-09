from core.base.database.database import Database
from core.base.file_access import FileAccess
from core.base.provider.context_window import ContextWindow
from tests.stories.core.support.fixtures import UserJoined


def test_a_status_file_is_read_once_however_many_cards_ask_for_its_context(new_story, tmp_path):
    story = new_story(fixture=UserJoined)
    status = tmp_path / "s-1.json"
    FileAccess.shared().write(status, '{"context_window": {"used_percentage": 42, "total_input_tokens": 1000}}')
    with story.container.get(Database).repeated_work.request():
        windows = [ContextWindow.read_status_file(status) for _ in range(2)]
    story.expect_rows([(window.used_percentage, window.total_input_tokens) for window in windows] == [(42, 1000)] * 2, detail=str(windows))
