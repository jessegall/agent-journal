from engine.environment.environment_names import EnvironmentNames
from engine.file.file_access import FileAccess
from engine.enums.process_type import ProcessType
from core.modules.processes.support.request_log import RequestLog
from core.modules.processes.support.request_log_entry import RequestLogEntry
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story


def test_a_viewer_line_keeps_a_request_row_in_the_environment_it_runs_in(new_story):
    story = new_story(fixture=UserJoined)
    with server_story(story) as server:
        server.story.run('actor make user "Ada"')
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        server.expect_viewer_line(cookie, {"window": "viewer.shell", "line": ["task", "list"], "environment": "main"}, 200, '"code": 0')
    main_id = story.container.get(EnvironmentNames).environment_id("main")
    logged = [RequestLogEntry.parsed(line) for line in FileAccess.shared().read(RequestLog(story.home, FileAccess.shared()).lines.path).splitlines() if line]
    viewer_rows = [entry for entry in logged if entry.process_type is ProcessType.JOURNAL and entry.line.startswith("journal task list")]
    story.expect_rows(len(viewer_rows) == 1, viewer_rows[0].environment_id == main_id if viewer_rows else False, viewer_rows[0].agent_id is None if viewer_rows else False, detail=str(logged))
