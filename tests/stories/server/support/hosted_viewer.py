import grp
import os
import shutil
import tempfile
from pathlib import Path

import pytest

from server.viewer.viewer_socket_listener import ViewerSocketListener
from tests.stories.server.support.server_client import answer_from as parsed_answer, raw_answer, server_story

PUBLIC_ORIGIN = "https://journal.example.com"
PUBLIC_HOST = "journal.example.com"


def group_name() -> str:
    return grp.getgrgid(os.getgid()).gr_name


def socket_raw(socket_path: Path, method: str, route: str, host: str = PUBLIC_HOST, headers: dict[str, str] | None = None, body: str = "",
               declared_bytes: int | None = None) -> bytes:
    header_lines = "".join(f"{name}: {value}\r\n" for name, value in (headers or {}).items())
    length = len(body) if declared_bytes is None else declared_bytes
    head = f"{method} {route} HTTP/1.1\r\nHost: {host}\r\n{header_lines}Content-Length: {length}\r\nConnection: close\r\n\r\n"
    return raw_answer(socket_path, (head + body).encode())


def socket_answer(socket_path: Path, method: str, route: str, host: str = PUBLIC_HOST, headers: dict[str, str] | None = None, body: str = "",
                  declared_bytes: int | None = None):
    return parsed_answer(socket_raw(socket_path, method, route, host, headers, body, declared_bytes))


def reply_headers(raw: bytes) -> dict[str, str]:
    lines = raw.partition(b"\r\n\r\n")[0].decode().split("\r\n")[1:]
    return {name: value.strip() for name, _, value in (line.partition(":") for line in lines)}


@pytest.fixture
def socket_path():
    folder = Path(tempfile.mkdtemp(dir="/tmp"))
    yield folder / "viewer.sock"
    shutil.rmtree(folder)


def hosted_viewer_factory(socket_path: Path, proxy_uid: int):
    return lambda login, routes: ViewerSocketListener(login, routes, socket_path, group_name(), PUBLIC_ORIGIN, proxy_uid)


@pytest.fixture
def hosted_server(new_story, socket_path):
    with server_story(new_story(), viewer_factory=hosted_viewer_factory(socket_path, os.getuid())) as server:
        yield server, socket_path
