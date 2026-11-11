from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.registry.registry import Registry
from engine.repository.repository import Repository
from core.modules.viewer.commands.support.window_allowances import WindowAllowances
from core.modules.viewer.models.window_permission import WindowPermission
from core.modules.viewer.models.enums.window_permission_type import WindowPermissionType
from core.modules.viewer.commands.trust_window.trust_window import TrustWindow
from engine.command.person_check import PersonCheck


class TrustWindowHandler(Handler[TrustWindow, WindowPermission]):
    """Writes the caller's page trust of a module at the module's current code fingerprint, so a later upgrade
    asks again; the guard viewer.person-gives-permissions refuses any caller but a person trusting for
    themselves."""

    command = TrustWindow

    def __init__(self, registry: Registry, allowances: WindowAllowances, repository: Repository) -> None:
        self.registry, self.allowances, self.repository = registry, allowances, repository

    def handle(self, command: TrustWindow, context: Context) -> WindowPermission:
        if context.environment_id is None:
            raise Refusal("a module is trusted in an environment", "name one with --environment")
        fingerprint = self.registry.module_fingerprints.get(command.module)
        if fingerprint is None:
            raise Refusal(f"no installed module is named {command.module}", "journal module list shows them")
        PersonCheck.require(context, f"Allow the page code from {command.module} to run?")
        trust = self.allowances.permission(context.actor.id, command.module, WindowPermissionType.COMPONENT)
        return self.repository.merge(trust, WindowPermission(person_id=context.actor.id, creator_id=context.actor.id,
                                                                 subject=command.module, type=WindowPermissionType.COMPONENT, fingerprint=fingerprint), context)
