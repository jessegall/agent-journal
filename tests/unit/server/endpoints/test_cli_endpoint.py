import pytest

from core.base.caller.caller_request import CallerRequestError

from server.endpoints.cli_endpoint import ChunkStream, CliRequest, CliRequestError


def test_each_piece_of_output_is_handed_on_as_it_is_written():
    output_parts: list[bytes] = []
    stream = ChunkStream(output_parts.append)
    stream.write("first line\n")
    assert output_parts == [b"first line\n"]
    stream.write("")
    stream.write("second line\n")
    assert output_parts == [b"first line\n", b"second line\n"]


def test_a_request_takes_its_pid_from_the_socket_never_from_the_body():
    request = CliRequest.parsed({"argv": ["task", "list"], "variables": {"USER": "ada"}, "folder": "/work", "pid": 1}, 4321)
    assert (request.argv, request.caller.pid, request.caller.folder, dict(request.caller.variables)) == (["task", "list"], 4321, "/work", {"USER": "ada"})


@pytest.mark.parametrize("body", [[], {"argv": "task list"}, {"argv": ["task"], "variables": {"A": 1}}, {"argv": ["task"], "folder": 3}])
def test_a_body_that_is_no_command_line_is_refused(body):
    with pytest.raises((CliRequestError, CallerRequestError)):
        CliRequest.parsed(body, 1)
