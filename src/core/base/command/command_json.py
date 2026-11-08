import json
from dataclasses import fields, is_dataclass
from importlib import import_module

from core.base.command.command import Command

TYPE_KEY = "type"
FIELDS_KEY = "fields"
SIMPLE_TYPES = (str, int, float, bool, type(None))


class CommandJson:
    """A command as the text an approval keeps, so its card survives a restart and Accept runs exactly that
    command; only a command whose fields are text, numbers, booleans, nothing or lists of those can be
    kept."""

    @staticmethod
    def dump(command: Command[object]) -> str:
        values = {field.name: CommandJson.simple(command, field.name) for field in fields(command)}
        return json.dumps({TYPE_KEY: f"{type(command).__module__}.{type(command).__qualname__}", FIELDS_KEY: values})

    @staticmethod
    def simple(command: Command[object], name: str) -> object:
        value = getattr(command, name)
        if isinstance(value, SIMPLE_TYPES):
            return value
        if isinstance(value, tuple | list) and all(isinstance(item, SIMPLE_TYPES) for item in value):
            return list(value)
        raise TypeError(f"{type(command).__name__}.{name} is a {type(value).__name__}, which an approval cannot keep: give the command only text, numbers, booleans and lists of them")

    @staticmethod
    def load(text: str) -> Command[object]:
        stored = json.loads(text)
        module_name, _, class_name = str(stored[TYPE_KEY]).rpartition(".")
        command_type = getattr(import_module(module_name), class_name)
        if not (isinstance(command_type, type) and issubclass(command_type, Command) and is_dataclass(command_type)):
            raise TypeError(f"{stored[TYPE_KEY]} is no command")
        values = {name: tuple(value) if isinstance(value, list) else value for name, value in stored[FIELDS_KEY].items()}
        return command_type(**values)
