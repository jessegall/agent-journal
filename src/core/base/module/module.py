from collections.abc import Sequence
from typing import ClassVar, Never

from core.base.command.command import Command
from core.base.command.handler import Handler
from core.base.database.migration import Migration
from core.base.database.view import View
from core.base.guard.guard import Guard
from core.base.listener.commit_listener import CommitListener
from core.base.listener.deletion_listener import DeletionListener
from core.base.listener.save_listener import SaveListener
from core.base.module.model_declaration import ModelDeclaration
from core.base.subcommand.subcommand import ReadSubcommand, Subcommand

ListenerClass = type[DeletionListener] | type[SaveListener] | type[CommitListener]
SubcommandClass = type[Subcommand[Command[object], object]] | type[ReadSubcommand[object]]
HandlerClass = type[Handler[Never, object]]


class Module:
    """What a module adds to the journal, named by the classes themselves: its models, the modules it builds on,
    the core version it needs, its migrations and views, its handlers, subcommands, guards and listeners, the
    classes it binds in place of the core's interfaces, and the migration that removes its tables."""

    name: ClassVar[str]
    requires_core: ClassVar[str]
    dependencies: ClassVar[Sequence[str]] = ()
    models: ClassVar[Sequence[ModelDeclaration]] = ()
    migrations: ClassVar[Sequence[type[Migration]]] = ()
    views: ClassVar[Sequence[View]] = ()
    handlers: ClassVar[Sequence[HandlerClass]] = ()
    subcommands: ClassVar[Sequence[SubcommandClass]] = ()
    guards: ClassVar[Sequence[type[Guard]]] = ()
    listeners: ClassVar[Sequence[ListenerClass]] = ()
    removal: ClassVar[type[Migration] | None] = None
    bindings: ClassVar[Sequence[tuple[type, type]]] = ()
