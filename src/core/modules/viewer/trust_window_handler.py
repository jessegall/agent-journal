from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.base.repository.repository import Repository
from core.modules.viewer.window_allowances import WindowAllowances
from core.modules.viewer.window_permission import WindowPermission
from core.modules.viewer.window_permission_type import WindowPermissionType
from core.modules.viewer.trust_window import TrustWindow


class TrustWindowHandler(Handler[TrustWindow, WindowPermission]):
    """Writes the caller's page trust of a module at the module's current code fingerprint, so a later upgrade asks
    again; the guard viewer.person-gives-permissions refuses any caller but a person trusting for themselves."""

    command = TrustWindow

    def __init__(self, registry: Registry, allowances: WindowAllowances, repository: Repository) -> None:
        self.registry, self.allowances, self.repository = registry, allowances, repository

    def handle(self, command: TrustWindow, context: Context) -> WindowPermission:
        if context.environment_id is None:
            raise Refusal("a module is trusted in an environment", "name one with --environment")
        fingerprint = self.registry.module_fingerprints.get(command.module)
        if fingerprint is None:
            raise Refusal(f"no installed module is named {command.module}", "journal module list shows them")
        trust = self.allowances.permission(context.actor.id, context.environment_id, command.module, WindowPermissionType.COMPONENT)
        return self.repository.merge(trust, WindowPermission(environment_id=context.environment_id, person_id=context.actor.id, creator_id=context.actor.id,
                                                                 subject=command.module, type=WindowPermissionType.COMPONENT, fingerprint=fingerprint), context)
