import json
from dataclasses import fields, is_dataclass
from importlib import import_module
from typing import TypeIs

from engine.command.command import Command, is_command_class
from engine.command.built_command_types import BuiltCommandTypes
from engine.command.edit_command import is_edit_command
from engine.command.move_command import MoveCommand

TYPE_KEY = "type"
FIELDS_KEY = "fields"
MOVE_KEY = "move"
EDIT_KEY = "edit"
SIMPLE_TYPES = (str, int, float, bool, type(None))


class CommandJson:
    """A command as the text an approval keeps, so its card survives a restart and Accept runs exactly that
    command; only a command whose fields are text, numbers, booleans, nothing or lists of those can be
    kept. A move or edit command the core builds when a command line is read is kept by its model's command name (and
    its move), since no module can import it."""

    @staticmethod
    def dump(command: Command[object]) -> str:
        values = {field.name: CommandJson.simple(command, field.name) for field in fields(command)}
        stored: dict[str, object] = {TYPE_KEY: f"{type(command).__module__}.{type(command).__qualname__}", FIELDS_KEY: values}
        if isinstance(command, MoveCommand):
            stored[MOVE_KEY] = [type(command).model().cli_name, type(command).move.name]
        elif is_edit_command(command) and not CommandJson.is_importable(type(command)):
            stored[EDIT_KEY] = type(command).model().cli_name
        return json.dumps(stored)

    @staticmethod
    def is_importable(command_type: type) -> bool:
        return getattr(import_module(command_type.__module__), command_type.__qualname__, None) is command_type

    @staticmethod
    def simple(command: Command[object], name: str) -> object:
        value: object = getattr(command, name)
        if isinstance(value, SIMPLE_TYPES):
            return value
        if CommandJson.is_sequence(value) and all(isinstance(item, SIMPLE_TYPES) for item in value):
            return list(value)
        raise TypeError(f"{type(command).__name__}.{name} is a {type(value).__name__}, which an approval cannot keep: give the command only text, numbers, booleans and lists of them")

    @staticmethod
    def load(text: str, built: BuiltCommandTypes) -> Command[object]:
        stored = json.loads(text)
        command_type = CommandJson.command_type(stored, built)
        if not (isinstance(command_type, type) and is_command_class(command_type) and is_dataclass(command_type)):
            raise TypeError(f"{stored[TYPE_KEY]} is no command")
        stored_fields: dict[str, object] = stored[FIELDS_KEY]
        values = {name: CommandJson.loaded(value) for name, value in stored_fields.items()}
        return command_type(**values)

    @staticmethod
    def command_type(stored: dict[str, object], built: BuiltCommandTypes) -> object:
        if MOVE_KEY in stored:
            cli_name, move_name = stored[MOVE_KEY]
            return built.move_command(str(cli_name), str(move_name))
        if EDIT_KEY in stored:
            return built.edit_command(str(stored[EDIT_KEY]))
        return CommandJson.imported(str(stored[TYPE_KEY]))

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
