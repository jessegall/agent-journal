import json
from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.base.repository.repository import Repository
from core.modules.viewer.window_allow import WindowAllow
from core.modules.viewer.window_allowances import WindowAllowances
from core.modules.viewer.window_permission import WindowPermission
from core.modules.viewer.window_permission_type import WindowPermissionType


class WindowAllowHandler(Handler[WindowAllow, WindowPermission]):
    """Writes the caller's permission row for the window: the lines it declares added to those allowed before; the
    guard viewer.person-gives-permissions refuses any caller but a person allowing for themselves."""

    command = WindowAllow

    def __init__(self, registry: Registry, allowances: WindowAllowances, repository: Repository) -> None:
        self.registry, self.allowances, self.repository = registry, allowances, repository

    def handle(self, command: WindowAllow, context: Context) -> WindowPermission:
        if context.environment_id is None:
            raise Refusal("a window is allowed in an environment", "name one with --environment")
        if not self.registry.has_window(command.window) or command.type is WindowPermissionType.PAGE:
            raise Refusal(f"no installed module declares the window {command.window} with {command.type} to allow", "journal window trust <module> trusts a module's page code")
        window = self.registry.window(command.window)
        declared = window.reads if command.type is WindowPermissionType.READS else window.runs
        permission = self.allowances.permission(context.actor.id, context.environment_id, command.window, command.type)
        if permission is not None:
            return self.repository.save(replace(permission, lines=json.dumps(sorted({*json.loads(permission.lines), *declared}))), context)
        return self.repository.save(WindowPermission(environment_id=context.environment_id, person_id=context.actor.id, creator_id=context.actor.id,
                                                     subject=command.window, type=command.type, lines=json.dumps(sorted(declared))), context)
