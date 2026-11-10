from dataclasses import dataclass

import pytest

from engine.command.command import Command
from engine.command.command_json import CommandJson


@dataclass(frozen=True)
class ObjectHolder(Command[object]):
    value: object


@dataclass(frozen=True)
class SampleRetire(Command[object]):
    agent_id: int
    reason: str


def test_a_command_is_kept_as_text_and_loaded_as_the_same_command():
    command = SampleRetire(7, "done with it")
    assert CommandJson.load(CommandJson.dump(command)) == command


def test_a_command_holding_an_object_cannot_be_kept():
    with pytest.raises(TypeError, match="ObjectHolder.value"):
        CommandJson.dump(ObjectHolder(object()))


def test_text_that_names_no_command_is_not_loaded():
    with pytest.raises(TypeError):
        CommandJson.load('{"type": "builtins.dict", "fields": {}}')
