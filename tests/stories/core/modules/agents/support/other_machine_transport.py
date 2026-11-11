from collections.abc import Mapping

from engine.module.module import Module
from core.modules.agents.support.program_transport import ProgramTransport

OTHER_MACHINE = "tests.stories.core.modules.agents.support.other_machine_transport:OtherMachineModule"
STARTED_ANSWER = b"started 9001\n"


class OtherMachineTransport(ProgramTransport):
    """A made-up transport to a launcher on another machine: it keeps what it was asked, and a program it
    started runs until it is stopped."""

    def __init__(self) -> None:
        self.starts, self.stopped_ids, self.stop_request_ids = list[Mapping[str, object]](), list[int](), list[int]()

    @property
    def is_running(self) -> bool:
        return True

    def start(self, request: Mapping[str, object]) -> bytes | None:
        self.starts.append(request)
        return STARTED_ANSWER

    def stop(self, agent_id: int) -> bool:
        self.stopped_ids.append(agent_id)
        return True

    def request_stop(self, agent_id: int) -> None:
        self.stop_request_ids.append(agent_id)

    def idle_seconds(self, agent_id: int) -> int | None:
        return None

    def has_program(self, agent_id: int) -> bool:
        return any(start["agent_id"] == agent_id for start in self.starts) and agent_id not in self.stopped_ids


class OtherMachineModule(Module):
    """A sample module that binds the transport to another machine, loaded after the agents module so that its
    binding is the one in force."""

    name = "acme.other-machine"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents", "journal.suites.coding.workers"]
    bindings = {ProgramTransport: OtherMachineTransport}
