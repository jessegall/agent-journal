from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.viewer.window_allowances import WindowAllowances
from core.modules.viewer.window_permission import WindowPermission
from core.modules.viewer.window_permission_type import WindowPermissionType
from core.modules.viewer.window_trust import WindowTrust


class WindowTrustHandler(Handler[WindowTrust, WindowPermission]):
    """Writes the caller's page trust of a module at the module's current code fingerprint, so a later upgrade asks
    again; the guard viewer.person-gives-permissions refuses any caller but a person trusting for themselves."""

    command = WindowTrust

    def __init__(self, allowances: WindowAllowances, repository: Repository) -> None:
        self.allowances, self.repository = allowances, repository

    def handle(self, command: WindowTrust, context: Context) -> WindowPermission:
        if context.environment_id is None:
            raise Refusal("a module is trusted in an environment", "name one with --environment")
        fingerprint = self.allowances.module_fingerprint(command.module)
        if not fingerprint:
            raise Refusal(f"no installed module is named {command.module}", "journal module list shows them")
        trust = self.allowances.permission(context.actor.id, context.environment_id, command.module, WindowPermissionType.PAGE)
        if trust is not None:
            return self.repository.save(replace(trust, fingerprint=fingerprint), context)
        return self.repository.save(WindowPermission(environment_id=context.environment_id, person_id=context.actor.id, creator_id=context.actor.id,
                                                     subject=command.module, type=WindowPermissionType.PAGE, fingerprint=fingerprint), context)
