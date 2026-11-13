from collections.abc import Mapping
from dataclasses import dataclass
from types import MappingProxyType

from engine.file.file_access import FileAccess
from engine.hosting.host_probe import HostProbe
from engine.hosting.hosted_file import HostedFile
from engine.hosting.hosting import Hosting
from engine.testing.stories.story import Story
from server.door.socket_peer import SocketPeer
from tests.stories.engine.hosting.support.fake_host import FakeHost

HOSTED_FILE_NAME = "hosted.toml"
HOSTED_TEXT = """public_origin = "https://journal.example.com"
agent_user = "journal-agent"
proxy_user = "caddy"
idle_minutes = 60
absolute_hours = 24
recent_login_minutes = 5
allow_app_codes = true
"""
EMPTY_AGENTS: Mapping[int, int] = MappingProxyType({})


class FakeSocketPeers:
    """The kernel's pid and uid of each connection, set by the story: the peer of the next request."""

    def __init__(self) -> None:
        self.next_peer = SocketPeer(1, 0)

    def set_next_peer(self, pid: int, uid: int) -> None:
        self.next_peer = SocketPeer(pid, uid)


@dataclass(frozen=True)
class FakeAgentGroup:
    """The agent id by the pid of each process the kernel says belongs to the agent group, standing in for /proc."""

    agent_ids: Mapping[int, int]


@dataclass(frozen=True)
class HostedKernel:
    """The kernel facts a hosted story fakes: the host, each connection's peer and the agent group."""

    host: HostProbe
    peers: FakeSocketPeers
    agent_group: FakeAgentGroup


def start_hosted(story: Story, agent_group: Mapping[int, int] = EMPTY_AGENTS, text: str = HOSTED_TEXT) -> HostedKernel:
    path = story.home.folder / HOSTED_FILE_NAME
    FileAccess.write(path, text)
    story.bind(Hosting, HostedFile(path).hosting())
    return HostedKernel(FakeHost(), FakeSocketPeers(), FakeAgentGroup(agent_group))
