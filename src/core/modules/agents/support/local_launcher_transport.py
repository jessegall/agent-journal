from collections.abc import Mapping

from core.modules.agents.support.launcher_link import ANSWER_BYTES, LauncherLink
from core.modules.agents.support.program_transport import ProgramTransport


class LocalLauncherTransport(ProgramTransport):
    """Reaches the launcher of this machine on its socket."""

    def __init__(self, link: LauncherLink) -> None:
        self.link = link

    def start(self, request: Mapping[str, object]) -> bytes | None:
        return self.link.request_launcher(request, ANSWER_BYTES)

    def stop(self, agent_id: int) -> bool:
        return self.link.stop(agent_id)

    def request_stop(self, agent_id: int) -> None:
        self.link.request_stop(agent_id)

    def idle_seconds(self, agent_id: int) -> int | None:
        return self.link.idle_seconds(agent_id)

    def has_program(self, agent_id: int) -> bool:
        return self.link.has_program(agent_id)
