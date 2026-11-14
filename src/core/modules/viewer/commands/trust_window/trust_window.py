from dataclasses import dataclass

from engine.command.command import Command
from core.modules.viewer.models.window_permission import WindowPermission


@dataclass(frozen=True)
class TrustWindow(Command[WindowPermission]):
    """Trusts a module's code in the viewer's page, for the caller in the caller's environment, at its current
    code."""

    module: str
