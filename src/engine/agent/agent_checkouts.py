from pathlib import Path

from engine.checkout.checkout import Checkout
from engine.checkout.checkout_file import CheckoutFile
from engine.file.file_state import FileState
from engine.enums.file_status import FileStatus
from engine.errors.refusal import Refusal


class AgentCheckouts:
    """The checkout of an agent, answered by the module that knows its rows and by a suite whose agents have
    their own. file_state may run a slow program, so it is never called under the write lock; here it knows
    no base."""

    def checkout(self, agent_id: int) -> Checkout:
        raise NotImplementedError

    def file_checkout(self, agent_id: int, path: Path) -> Checkout:
        return self.checkout(agent_id)

    def base_text(self, checkout: Checkout, relative: str) -> str:
        raise Refusal("this project keeps no base commit", "read the file with --from checkout")

    def changed_files(self, checkout: Checkout, base_commit: str) -> tuple[CheckoutFile, ...]:
        return ()

    def file_state(self, checkout: Checkout, relative: str) -> FileState:
        missing = checkout.exists and not (checkout.root / relative).exists()
        return FileState(FileStatus.DELETED if missing else FileStatus.CHANGED, False)
