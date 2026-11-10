from pathlib import Path

from core.base.agent_checkouts import AgentCheckouts
from core.base.caller.caller import Caller
from engine.checkout.checkout import Checkout
from core.base.file_access import FileAccess
from engine.errors.missing_file_refusal import MissingFileRefusal
from core.base.project_reads import ProjectReads
from engine.errors.refusal import Refusal
from core.modules.plugins.support.plugin_call_access import PluginCallAccess
from core.modules.plugins.support.plugin_file_place import PluginFilePlace

READ_HINT = "a limited agent reads its own checkout, and in the project only the folders plugins declare in project_reads"


class PluginFileText:
    """Reads a file from a checkout, project or base commit within the caller's access limits."""

    def __init__(self, checkouts: AgentCheckouts, reads: ProjectReads, access: PluginCallAccess) -> None:
        self.checkouts, self.reads, self.access = checkouts, reads, access

    def text(self, checkout: Checkout, name: str, place: PluginFilePlace, caller: Caller) -> str:
        if Path(name).is_absolute() or ".." in Path(name).parts:
            raise Refusal(f"{name} leaves the checkout", "name a file by its path from the root of the checkout")
        if place is PluginFilePlace.BASE:
            return self.checkouts.base_text(checkout, name)
        if place is PluginFilePlace.PROJECT:
            return self.project_text(checkout, name, caller)
        return self.checkout_text(checkout, name, caller)

    def checkout_text(self, checkout: Checkout, name: str, caller: Caller) -> str:
        if not checkout.exists:
            raise Refusal(f"the checkout of this agent is gone, so {name} cannot be read there", "read it from the base with --from base")
        real = (checkout.root / name).resolve()
        limit = checkout.root if self.access.is_limited(caller) else checkout.project_root
        if not real.is_relative_to(checkout.root) and not real.is_relative_to(limit):
            raise Refusal(f"{name} leaves the checkout through a link", READ_HINT)
        return self.file_text(real, name)

    def project_text(self, checkout: Checkout, name: str, caller: Caller) -> str:
        real = (checkout.project_root / name).resolve()
        if not real.is_relative_to(checkout.project_root):
            raise Refusal(f"{name} leaves the project through a link", READ_HINT)
        if self.access.is_limited(caller) and checkout.root != checkout.project_root and not any(real.is_relative_to(folder) for folder in self.reads.folders(checkout.project_root)):
            raise Refusal(f"{name} is past the read limit of this agent", READ_HINT)
        return self.file_text(real, name)

    @staticmethod
    def file_text(real: Path, name: str) -> str:
        if not real.is_file():
            raise MissingFileRefusal(f"{name} is not there, at {real}", "it may be new in the checkout: read it with --from checkout")
        return FileAccess.shared().read(real, errors="replace")
