from dataclasses import dataclass

import pytest

from core.base.command.command import Command
from core.base.command.command_json import CommandJson
from core.modules.agents.commands.retire_agent.retire_agent import RetireAgent


@dataclass(frozen=True)
class HoldsAnObject(Command[object]):
    value: object


def test_a_command_is_kept_as_text_and_loaded_as_the_same_command():
    command = RetireAgent(7, "done with it")
    assert CommandJson.load(CommandJson.dump(command)) == command


def test_a_command_holding_an_object_cannot_be_kept():
    with pytest.raises(TypeError, match="HoldsAnObject.value"):
        CommandJson.dump(HoldsAnObject(object()))


def test_text_that_names_no_command_is_not_loaded():
    with pytest.raises(TypeError):
        CommandJson.load('{"type": "builtins.dict", "fields": {}}')
