from pathlib import Path

from core.base.checkout import Checkout
from core.base.file_state import FileState
from core.base.file_status import FileStatus


class AgentCheckouts:
    """The checkout of an agent, answered by the module that knows its rows and by a suite whose agents have
    their own. file_state may run a slow program, so it is never called under the write lock; here it knows
    no base."""

    def checkout(self, agent_id: int) -> Checkout:
        raise NotImplementedError

    def file_checkout(self, agent_id: int, path: Path) -> Checkout:
        return self.checkout(agent_id)

    def file_state(self, checkout: Checkout, relative: str) -> FileState:
        missing = checkout.exists and not (checkout.root / relative).exists()
        return FileState(FileStatus.DELETED if missing else FileStatus.CHANGED, False)
