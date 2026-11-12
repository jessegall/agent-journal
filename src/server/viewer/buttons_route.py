from engine.database.database import Database
from engine.environment.environment_names import EnvironmentNames
from engine.module.journal_container import synced_container
from engine.journal.journal_home import JournalHome
from engine.errors.refusal import Refusal
from engine.registry.registry import Registry
from engine.enums.button_window import ButtonWindow
from core.modules.drivers.support.active_modules import ActiveModules
from core.modules.viewer.commands.support.window_allowances import WindowAllowances
from core.modules.viewer.models.enums.window_permission_type import WindowPermissionType
from server.viewer.button_permission import ButtonPermission
from server.viewer.buttons_listing import ButtonsListing
from engine.scope.scopes import Scopes
from server.errors.unknown_environment_error import UnknownEnvironmentError


class ButtonsRoute:
    """Lists active buttons and the command lines a user has yet to allow."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def buttons(self, environment: str, person_id: int) -> ButtonsListing:
        container = synced_container(self.home)
        try:
            try:
                environment_id = container.get(EnvironmentNames).environment_id(environment)
            except Refusal as refusal:
                raise UnknownEnvironmentError(refusal.reason) from refusal
            registry = container.get(Registry)
            active = container.get(ActiveModules)
            allowances = container.get(WindowAllowances)
            missing: dict[str, list[ButtonPermission]] = {}
            with container.get(Scopes).read_scope((), None, environment_id):
                buttons = tuple(button.listed() for button in registry.buttons if active.is_active(button.module))
                for button in registry.button_lines(ButtonWindow.MARKS):
                    if button.shipped or not active.is_active(button.module):
                        continue
                    allowed = allowances.allowed_lines(person_id, button.subject, WindowPermissionType.RUNS)
                    if button.permission_line in allowed:
                        continue
                    missing.setdefault(button.module, []).append(ButtonPermission(button.label, button.permission_line))
            return ButtonsListing(buttons, missing)
        finally:
            container.get(Database).close()
