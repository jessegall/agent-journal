import sys

import pytest

from core.base.cli.default_subcommands import ListSubcommand, MoveSubcommand
from core.base.cli.subcommand_lookup import SubcommandLookup, UsageError
from core.base.registry.dotted_path import DottedPath
from core.base.registry.noun_entry import NounEntry
from core.base.registry.registry import Registry
from tests.core.base.harness import harness

UNUSED = "tests.core.base.lookup_unused_sample"


def lookup(tmp_path) -> SubcommandLookup:
    subcommands = {"loan make": DottedPath("tests.core.base.lookup_sample:LoanMakeOwn"), "loan renew": DottedPath(f"{UNUSED}:LoanRenewOwn")}
    nouns = {"loan": NounEntry("loans", DottedPath("tests.core.base.test_model:Loan"), ())}
    return harness(tmp_path, Registry("abc", nouns, {}, subcommands, (), ())).get(SubcommandLookup)


def test_a_modules_own_subcommand_wins_over_the_built_one(tmp_path):
    assert type(lookup(tmp_path).subcommand("loan", "make")).__name__ == "LoanMakeOwn"


def test_the_built_subcommands_answer_the_rest_and_nothing_else_is_imported(tmp_path):
    sys.modules.pop(UNUSED, None)
    subcommands = lookup(tmp_path)
    assert isinstance(subcommands.subcommand("loan", "list"), ListSubcommand)
    assert isinstance(subcommands.subcommand("loan", "bring-back"), MoveSubcommand)
    assert UNUSED not in sys.modules


@pytest.mark.parametrize(("cli_noun", "name", "text"), [("shelf", "list", "no noun shelf"), ("loan", "renew-twice", "no subcommand renew-twice")])
def test_an_unknown_noun_or_subcommand_is_a_usage_error(tmp_path, cli_noun: str, name: str, text: str):
    with pytest.raises(UsageError, match=text):
        lookup(tmp_path).subcommand(cli_noun, name)
