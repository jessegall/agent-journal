import inspect
from collections.abc import Sequence
from pathlib import Path
from typing import ClassVar, Never

from core.base.chat.dock_declaration import DockDeclaration
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.command.command import Command
from core.base.command.handler import Handler
from core.base.database.migration import Migration
from core.base.driver.driver import Driver
from core.base.driver.driver_rule import DriverRule
from core.base.driver.overlay import Overlay
from core.base.driver.suite import Suite
from core.base.guard.guard import Guard
from core.base.listener.commit_listener import CommitListener
from core.base.listener.deletion_listener import DeletionListener
from core.base.listener.save_listener import SaveListener
from core.base.model.view_model import ViewModel
from core.base.module.model_declaration import ModelDeclaration
from core.base.provider.provider import Provider
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.subcommand.subcommand import Subcommand
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.setting.setting_group import SettingGroup
from core.base.setting.setting_value import SettingValue

ListenerClass = type[DeletionListener] | type[SaveListener] | type[CommitListener]
SubcommandClass = type[Subcommand[Command[object], object]] | type[ReadSubcommand[object]]
HandlerClass = type[Handler[Never, object]]

WEB_FOLDER = Path("web") / "dist"


class Module:
    """What a module adds to the journal, named by the classes themselves: its models, the modules it builds on,
    the core version it needs, its migrations and views, its handlers, subcommands, guards and listeners, the
    classes it binds in place of the core's interfaces, the migration that removes its tables, and the suites,
    drivers, overlays, driver rules, windows, chat marks, docked items and agent programs it adds."""

    name: ClassVar[str]
    requires_core: ClassVar[str]
    dependencies: ClassVar[Sequence[str]] = ()
    models: ClassVar[Sequence[ModelDeclaration]] = ()
    migrations: ClassVar[Sequence[type[Migration]]] = ()
    views: ClassVar[Sequence[type[ViewModel]]] = ()
    handlers: ClassVar[Sequence[HandlerClass]] = ()
    subcommands: ClassVar[Sequence[SubcommandClass]] = ()
    guards: ClassVar[Sequence[type[Guard]]] = ()
    listeners: ClassVar[Sequence[ListenerClass]] = ()
    removal: ClassVar[type[Migration] | None] = None
    bindings: ClassVar[Sequence[tuple[type, type]]] = ()
    suites: ClassVar[Sequence[type[Suite]]] = ()
    drivers: ClassVar[Sequence[type[Driver]]] = ()
    overlays: ClassVar[Sequence[type[Overlay]]] = ()
    driver_rules: ClassVar[Sequence[type[DriverRule]]] = ()
    windows: ClassVar[Sequence[WindowDeclaration]] = ()
    marks: ClassVar[Sequence[MarkDeclaration]] = ()
    docks: ClassVar[Sequence[DockDeclaration]] = ()
    providers: ClassVar[Sequence[type[Provider]]] = ()
    settings: ClassVar[Sequence[SettingGroup | SettingValue]] = ()

    @classmethod
    def folder(cls) -> Path:
        return Path(inspect.getfile(cls)).resolve().parent

    @classmethod
    def web_folder(cls) -> Path:
        return cls.folder() / WEB_FOLDER
