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


class SampleMoves:
    def move_command(self, cli_name: str, move_name: str) -> type[Command[object]]:
        assert (cli_name, move_name) == ("agent", "retire")
        return SampleRetire


def test_a_command_is_kept_as_text_and_loaded_as_the_same_command():
    command = SampleRetire(7, "done with it")
    assert CommandJson.load(CommandJson.dump(command), SampleMoves()) == command


def test_a_command_holding_an_object_cannot_be_kept():
    with pytest.raises(TypeError, match="ObjectHolder.value"):
        CommandJson.dump(ObjectHolder(object()))


def test_text_that_names_no_command_is_not_loaded():
    with pytest.raises(TypeError):
        CommandJson.load('{"type": "builtins.dict", "fields": {}}', SampleMoves())


def test_a_move_command_is_loaded_by_its_model_and_its_move():
    text = '{"type": "engine.cli.default_subcommands.RetireAgent", "fields": {"agent_id": 7, "reason": "done"}, "move": ["agent", "retire"]}'
    assert CommandJson.load(text, SampleMoves()) == SampleRetire(7, "done")
