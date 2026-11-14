from dataclasses import MISSING, Field, fields

from engine.errors.refusal import Refusal
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_key import WindowKey


class Window(WindowDeclaration):
    """A window written as a class in its own file: its fields are the fields of a window declaration, and its keys
    are key classes. A window that names no reads reads what its keys read."""

    @classmethod
    def declaration(cls) -> WindowDeclaration:
        keys = tuple(cls.declared_key(key) for key in cls.keys)
        values = {field.name: cls.field_value(field) for field in fields(WindowDeclaration)}
        reads = cls.reads or tuple(dict.fromkeys(key.read for key in keys))
        return WindowDeclaration(**{**values, "keys": keys, "reads": reads})

    # a field whose default is made fresh for each declaration has no class attribute unless the window sets it
    @classmethod
    def field_value(cls, field: Field[object]) -> object:
        if hasattr(cls, field.name) or field.default_factory is MISSING:
            return getattr(cls, field.name)
        return field.default_factory()

    @classmethod
    def declared_key(cls, key: object) -> WindowKey:
        if not (isinstance(key, type) and issubclass(key, WindowKey)):
            raise Refusal(f"{cls.name} lists the key {key!r}, which is no key class", "write the key as a class in its own file and list the class")
        return key.declared()
