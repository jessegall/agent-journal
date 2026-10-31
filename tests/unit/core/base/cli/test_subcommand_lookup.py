import sys

import pytest

from core.base.cli.list_subcommand import ListSubcommand
from core.base.cli.move_subcommand import MoveSubcommand
from core.base.cli.subcommand_lookup import SubcommandLookup
from core.base.cli.usage_error import UsageError
from core.base.registry.dotted_path import DottedPath
from core.base.registry.model_entry import ModelEntry
from core.base.registry.registry import Registry
from tests.unit.core.base.sample_container import sample_container

UNUSED = "tests.unit.core.base.samples.lookup_unused_sample"


def lookup(tmp_path) -> SubcommandLookup:
    subcommands = {"item make": DottedPath("tests.unit.core.base.samples.lookup_sample:ItemMakeOwn"), "item archive": DottedPath(f"{UNUSED}:ItemArchiveOwn")}
    models = {"item": ModelEntry("items", DottedPath("tests.unit.core.base.model.test_model:Item"), ())}
    return sample_container(tmp_path, Registry("abc", models, {}, subcommands, (), ())).get(SubcommandLookup)


def test_a_modules_own_subcommand_wins_over_the_built_one(tmp_path):
    assert type(lookup(tmp_path).subcommand("item", "make")).__name__ == "ItemMakeOwn"


def test_the_built_subcommands_answer_the_rest_and_nothing_else_is_imported(tmp_path):
    sys.modules.pop(UNUSED, None)
    subcommands = lookup(tmp_path)
    assert isinstance(subcommands.subcommand("item", "list"), ListSubcommand)
    assert isinstance(subcommands.subcommand("item", "close"), MoveSubcommand)
    assert UNUSED not in sys.modules


@pytest.mark.parametrize(("cli_name", "name", "text"), [("shelf", "list", "no shelf commands"), ("item", "archive-twice", "no subcommand archive-twice")])
def test_an_unknown_noun_or_subcommand_is_a_usage_error(tmp_path, cli_name: str, name: str, text: str):
    with pytest.raises(UsageError, match=text):
        lookup(tmp_path).subcommand(cli_name, name)
