import io
import json

import pytest

from core.base.caller.caller_request import CallerRequest, CallerRequestError
from core.base.cli.line_run import LineRun
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.timing import Timing
from tests.unit.core.base.module.test_module_sync import ITEMS

from server.endpoints.cli_endpoint import CliEndpoint
from server.endpoints.chunk_stream import ChunkStream
from server.endpoints.cli_request import CliRequest
from server.endpoints.cli_request_error import CliRequestError


def test_each_piece_of_output_is_handed_on_as_it_is_written():
    output_parts: list[bytes] = []
    stream = ChunkStream(output_parts.append)
    stream.write("first line\n")
    assert output_parts == [b"first line\n"]
    stream.write("")
    stream.write("second line\n")
    assert output_parts == [b"first line\n", b"second line\n"]


def test_a_request_takes_its_pid_from_the_socket_never_from_the_body():
    request = CliRequest.parsed({"argv": ["task", "list"], "variables": {"USER": "ada"}, "folder": "/work", "pid": 1}, 4321, Timing())
    assert (request.argv, request.caller.pid, request.caller.folder, dict(request.caller.variables)) == (["task", "list"], 4321, "/work", {"USER": "ada"})


@pytest.mark.parametrize("body", [[], {"argv": "task list"}, {"argv": ["task"], "variables": {"A": 1}}, {"argv": ["task"], "folder": 3}])
def test_a_body_that_is_no_command_line_is_refused(body):
    with pytest.raises((CliRequestError, CallerRequestError)):
        CliRequest.parsed(body, 1, Timing())


def test_the_answer_stamps_the_timing_the_request_carries(tmp_path):
    home = JournalHome(tmp_path)
    home.module_list.write_text(json.dumps([ITEMS]))
    assert LineRun(home).run(["module", "sync"], CallerRequest(), io.StringIO()) == 0
    endpoint = CliEndpoint(home, synced_container(home).get(CommitListenerRunner))
    timing = Timing.parsed("go_sent=1761904800015420")
    assert endpoint.answer(CliRequest(["item", "make", "Dune"], CallerRequest(), timing=timing), io.StringIO()) == 0
    assert [name for name, _ in timing.stamps] == ["go_sent", "command_started", "write_started", "committed"]
