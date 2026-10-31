from argparse import ArgumentParser
from dataclasses import dataclass

import pytest

from core.base.actor import Actor, ActorType
from core.base.subcommand.caller import Caller
from core.base.cli.default_subcommands import DefaultSubcommands
from core.base.subcommand.subcommand import ReadSubcommand, Subcommand
from core.base.command.bus import Bus
from core.base.container import Container
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.command.move_command import MoveCommand
from core.base.missing_rows import MissingRows
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.model.model import Model
from tests.core.base.test_commands import LoanMake
from tests.core.base.test_commit_listener_runner import container_with
from tests.core.base.test_lifecycle import LoanLifecycle, LoanState
from tests.core.base.test_model import Loan

CALLER = Caller(Actor(7, ActorType.AGENT))
FINES = ("CREATE TABLE fines (id INTEGER PRIMARY KEY, loan_id INTEGER NOT NULL REFERENCES loans(id), amount INTEGER NOT NULL, version INTEGER NOT NULL,"
         " metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT")
FINE = "INSERT INTO fines (loan_id, amount, version, created_at, updated_at) VALUES (?, 5, 1, '2026-10-31T09:00:00+00:00', '2026-10-31T09:00:00+00:00')"


@dataclass(frozen=True, kw_only=True)
class Fine(Model):
    name = "fine"
    cli_noun = "fine"

    loan_id: int
    amount: int


@pytest.fixture
def container(tmp_path) -> Container:
    built = container_with(tmp_path)
    for title in ("Dune", "Emma", "Ulysses"):
        built.get(Bus).run(LoanMake(title=title), CALLER.actor)
    built.get(Database).update(Statement(FINES))
    for loan_id in (1, 1, 2):
        built.get(Database).insert(Statement(FINE, (loan_id,)))
    return built


def read(subcommand: ReadSubcommand[object], *argv: str) -> object:
    parser = ArgumentParser()
    subcommand.arguments(parser)
    return subcommand.read(parser.parse_args(list(argv)), CALLER)


def test_required_fields_are_arguments_and_optional_fields_are_flags(container):
    subcommand, parser = container.get(DefaultSubcommands).make(Loan), ArgumentParser()
    subcommand.arguments(parser)
    assert subcommand.command(parser.parse_args(["Dune"]), CALLER).model_fields() == {"title": "Dune", "state": LoanState.LENT}
    assert subcommand.command(parser.parse_args(["Dune", "--state", "late"]), CALLER).model_fields() == {"title": "Dune", "state": LoanState.LATE}
    with pytest.raises(SystemExit):
        parser.parse_args([])


def test_the_built_command_is_the_nouns_make_command_and_runs_through_the_bus(container):
    subcommand, parser = container.get(DefaultSubcommands).make(Loan), ArgumentParser()
    subcommand.arguments(parser)
    command = subcommand.command(parser.parse_args(["Middlemarch"]), CALLER)
    assert (command.model(), command.label()) == (Loan, "LoanMake")
    assert container.get(Bus).run(command, CALLER.actor).id == 4


def test_show_reads_one_row_and_a_missing_id_is_refused_by_noun(container):
    show = container.get(DefaultSubcommands).show(Loan)
    loan = read(show, "2")
    assert isinstance(loan, Loan) and loan.title == "Emma"
    with pytest.raises(MissingRows, match="loan 9"):
        read(show, "9")


def test_list_pages_newest_first_and_filters_by_enum_and_foreign_key(container):
    loans = container.get(DefaultSubcommands).list(Loan)
    assert [row.id for row in read(loans, "--limit", "2").rows] == [3, 2]
    assert [row.id for row in read(loans, "--limit", "2", "--page", "2").rows] == [1]
    assert [row.id for row in read(loans, "--oldest", "--limit", "1").rows] == [1]
    assert read(loans, "--state", "late").rows == ()
    assert [row.id for row in read(container.get(DefaultSubcommands).list(Fine), "--loan", "1").rows] == [2, 1]


def run(container: Container, subcommand: Subcommand[object, object], *argv: str) -> object:
    parser = ArgumentParser()
    subcommand.arguments(parser)
    return container.get(Bus).run(subcommand.command(parser.parse_args(list(argv)), CALLER), CALLER.actor)


def test_edit_changes_only_the_fields_named(container):
    edit = container.get(DefaultSubcommands).edit(Loan)
    loan = run(container, edit, "2", "--title", "Persuasion")
    assert isinstance(loan, Loan) and (loan.title, loan.state, loan.version) == ("Persuasion", LoanState.LENT, 2)
    assert run(container, edit, "2").title == "Persuasion"


def test_edit_has_no_flag_for_the_state(container):
    with pytest.raises(SystemExit):
        run(container, container.get(DefaultSubcommands).edit(Loan), "2", "--state", "late")


def test_delete_removes_a_row_and_a_referenced_row_names_the_referring_table(container):
    delete = container.get(DefaultSubcommands).delete(Loan)
    run(container, delete, "3")
    assert container.get(Queries).query(Loan).count() == 2
    with pytest.raises(Refusal, match="still referred to by fines"):
        run(container, delete, "1")


@dataclass(frozen=True)
class LoanBringBack(MoveCommand[Loan]):
    move = LoanLifecycle.bring_back
    title: str


def test_each_move_is_a_subcommand_and_a_typed_command_gives_its_fields_as_flags(container):
    overdue, bring_back = container.get(DefaultSubcommands).moves(Loan, ("tests.core.base.test_default_subcommands:LoanBringBack",))
    assert (overdue.name, bring_back.name) == ("overdue", "bring-back")
    assert run(container, overdue, "1").state == LoanState.LATE
    with pytest.raises(SystemExit):
        run(container, bring_back, "2")
    loan = run(container, bring_back, "2", "--title", "Emma, returned")
    assert (loan.state, loan.title) == (LoanState.RETURNED, "Emma, returned")
