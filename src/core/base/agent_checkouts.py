from pathlib import Path

from core.base.checkout import Checkout
from core.base.file_state import FileState
from core.base.file_status import FileStatus


class AgentCheckouts:
    """The checkout of an agent, answered by the module that knows its rows and by a suite whose agents have their own."""

    def checkout(self, agent_id: int) -> Checkout:
        raise NotImplementedError

    def checkout_of_file(self, agent_id: int, path: Path) -> Checkout:
        """The checkout that holds this file, for an agent that may write in another's."""
        return self.checkout(agent_id)

    def file_state(self, checkout: Checkout, relative: str) -> FileState:
        """How a file stands when nothing can say what its base holds. It may run a slow program, so never call it under the write lock."""
        gone = checkout.exists and not (checkout.root / relative).exists()
        return FileState(FileStatus.DELETED if gone else FileStatus.CHANGED, False)
