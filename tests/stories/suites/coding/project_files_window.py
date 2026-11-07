from urllib.parse import urlencode

import pytest

from core.base.file_access import FileAccess
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment


@pytest.fixture
def project_files_server(new_story):
    story = new_story(fixture=BuilderWithUser)
    repository = repository_environment(story)
    (repository.folder / "shop files").mkdir()
    FileAccess.shared().write(repository.folder / "shop files" / "cart totals.py", "TOTAL = 1\n")
    repository.git("add", "shop files/cart totals.py")
    with server_story(story) as server:
        yield server, server.expect_viewer_login(server.viewer_key("Ada"))


def test_the_files_window_reads_only_the_folder_on_open(project_files_server):
    server, cookie = project_files_server
    status, answer = window_data(server, cookie, window="coding.files")
    rows = answer["keys"]["entries"]["value"]["rows"]
    server.story.expect_rows(status == 200, set(answer["keys"]) == {"entries"}, any(row["id"] == "shop files" and row["folder"] for row in rows))


def test_folder_and_search_state_keep_spaces_in_one_argument(project_files_server):
    server, cookie = project_files_server
    query = urlencode({"environment": "main", "entries.folder": "shop files", "matches.words": "cart totals"})
    status, answer = window_data(server, cookie, keys="entries,matches", window="coding.files", query=query)
    server.story.expect_rows(status == 200, set(answer["keys"]) == {"entries", "matches"},
                             all(answer["keys"][key]["value"]["rows"][0]["id"] == "shop files/cart totals.py" for key in ("entries", "matches")))


def test_the_file_key_reads_a_path_with_spaces(project_files_server):
    server, cookie = project_files_server
    query = urlencode({"environment": "main", "file.path": "shop files/cart totals.py"})
    status, answer = window_data(server, cookie, keys="file", window="coding.files", query=query)
    server.story.expect_rows(status == 200, set(answer["keys"]) == {"file"}, answer["keys"]["file"]["value"]["text"] == "TOTAL = 1\n")
