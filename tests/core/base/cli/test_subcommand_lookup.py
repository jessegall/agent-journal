import sys

import pytest

from core.base.cli.default_subcommands import ListSubcommand, MoveSubcommand
from core.base.cli.subcommand_lookup import SubcommandLookup, UsageError
from core.base.registry.dotted_path import DottedPath
from core.base.registry.noun_entry import NounEntry
from core.base.registry.registry import Registry
from tests.core.base.harness import harness

UNUSED = "tests.core.base.samples.lookup_unused_sample"


def lookup(tmp_path) -> SubcommandLookup:
    subcommands = {"item make": DottedPath("tests.core.base.samples.lookup_sample:ItemMakeOwn"), "item renew": DottedPath(f"{UNUSED}:ItemRenewOwn")}
    nouns = {"item": NounEntry("items", DottedPath("tests.core.base.model.test_model:Item"), ())}
    return harness(tmp_path, Registry("abc", nouns, {}, subcommands, (), ())).get(SubcommandLookup)


def test_a_modules_own_subcommand_wins_over_the_built_one(tmp_path):
    assert type(lookup(tmp_path).subcommand("item", "make")).__name__ == "ItemMakeOwn"


def test_the_built_subcommands_answer_the_rest_and_nothing_else_is_imported(tmp_path):
    sys.modules.pop(UNUSED, None)
    subcommands = lookup(tmp_path)
    assert isinstance(subcommands.subcommand("item", "list"), ListSubcommand)
    assert isinstance(subcommands.subcommand("item", "close"), MoveSubcommand)
    assert UNUSED not in sys.modules


@pytest.mark.parametrize(("cli_noun", "name", "text"), [("shelf", "list", "no noun shelf"), ("item", "renew-twice", "no subcommand renew-twice")])
def test_an_unknown_noun_or_subcommand_is_a_usage_error(tmp_path, cli_noun: str, name: str, text: str):
    with pytest.raises(UsageError, match=text):
        lookup(tmp_path).subcommand(cli_noun, name)
