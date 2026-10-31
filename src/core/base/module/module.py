from typing import ClassVar

from core.base.module.noun import Noun


class Module:
    """What a module adds to the journal, named by dotted paths so declaring a module imports none of its
    handlers, subcommands, guards or listeners: its nouns, the modules it builds on, the core version it
    needs, its migrations and views, its own classes, and the migration that removes its tables."""

    name: ClassVar[str]
    requires_core: ClassVar[str]
    dependencies: ClassVar[tuple[str, ...]] = ()
    nouns: ClassVar[tuple[Noun, ...]] = ()
    migrations: ClassVar[tuple[str, ...]] = ()
    views: ClassVar[tuple[str, ...]] = ()
    handlers: ClassVar[tuple[str, ...]] = ()
    subcommands: ClassVar[tuple[str, ...]] = ()
    guards: ClassVar[tuple[str, ...]] = ()
    listeners: ClassVar[tuple[str, ...]] = ()
    removal: ClassVar[str] = ""
    bindings: ClassVar[tuple[tuple[str, str], ...]] = ()
