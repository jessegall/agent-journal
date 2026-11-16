from engine.types.class_fields import class_fields
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_key import WindowKey


class Window(WindowDeclaration):
    """A window written as a class in its own file: its fields are the fields of a window declaration, and its keys
    are key classes. A window that names no reads reads what its keys read."""

    @classmethod
    def declaration(cls) -> WindowDeclaration:
        keys = tuple(cls.declared_key(key) for key in cls.keys)
        values = class_fields(cls, WindowDeclaration)
        reads = cls.reads or tuple(dict.fromkeys(key.read for key in keys))
        fields = {name: value for name, value in values.items() if name not in ("keys", "reads", "icon")}
        return WindowDeclaration(**fields, keys=keys, reads=reads, icon=cls.icon)

    @classmethod
    def declared_key(cls, key: object) -> WindowKey:
        return WindowKey.declared_class(cls.name, key)
