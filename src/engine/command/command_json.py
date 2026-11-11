import json
from dataclasses import fields, is_dataclass
from importlib import import_module
from typing import TypeIs

from engine.command.command import Command, is_command_class
from engine.command.move_command import MoveCommand
from engine.command.move_command_types import MoveCommandTypes

TYPE_KEY = "type"
FIELDS_KEY = "fields"
MOVE_KEY = "move"
SIMPLE_TYPES = (str, int, float, bool, type(None))


class CommandJson:
    """A command as the text an approval keeps, so its card survives a restart and Accept runs exactly that
    command; only a command whose fields are text, numbers, booleans, nothing or lists of those can be
    kept. A move command is kept by its model's command name and its move, since the core builds most of them
    when a command line is read and no module can import them."""

    @staticmethod
    def dump(command: Command[object]) -> str:
        values = {field.name: CommandJson.simple(command, field.name) for field in fields(command)}
        stored: dict[str, object] = {TYPE_KEY: f"{type(command).__module__}.{type(command).__qualname__}", FIELDS_KEY: values}
        if isinstance(command, MoveCommand):
            stored[MOVE_KEY] = [type(command).model().cli_name, type(command).move.name]
        return json.dumps(stored)

    @staticmethod
    def simple(command: Command[object], name: str) -> object:
        value: object = getattr(command, name)
        if isinstance(value, SIMPLE_TYPES):
            return value
        if CommandJson.is_sequence(value) and all(isinstance(item, SIMPLE_TYPES) for item in value):
            return list(value)
        raise TypeError(f"{type(command).__name__}.{name} is a {type(value).__name__}, which an approval cannot keep: give the command only text, numbers, booleans and lists of them")

    @staticmethod
    def load(text: str, moves: MoveCommandTypes) -> Command[object]:
        stored = json.loads(text)
        command_type = moves.move_command(*stored[MOVE_KEY]) if MOVE_KEY in stored else CommandJson.imported(str(stored[TYPE_KEY]))
        if not (isinstance(command_type, type) and is_command_class(command_type) and is_dataclass(command_type)):
            raise TypeError(f"{stored[TYPE_KEY]} is no command")
        stored_fields: dict[str, object] = stored[FIELDS_KEY]
        values = {name: CommandJson.loaded(value) for name, value in stored_fields.items()}
        return command_type(**values)

    @staticmethod
    def imported(type_path: str) -> object:
        module_name, _, class_name = type_path.rpartition(".")
        return getattr(import_module(module_name), class_name)

    @staticmethod
    def loaded(value: object) -> object:
        if not CommandJson.is_sequence(value):
            return value
        return tuple(value)

    @staticmethod
    def is_sequence(value: object) -> TypeIs[list[object] | tuple[object, ...]]:
        return isinstance(value, list | tuple)
