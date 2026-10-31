from core.base.database.migration import Migration
from core.base.module.module import Module
from core.base.module.noun import Noun
from tests.core.base.harness import LOANS
from tests.core.base.test_model import Loan


class LoansTable(Migration):
    number = 1
    statements = (LOANS,)


class LoansModule(Module):
    name = "loans"
    requires_core = ">=5,<6"
    nouns = (Noun(Loan),)
    migrations = ("tests.core.base.sync_sample:LoansTable",)
    handlers = ("core.base.command.handlers.make_handler:MakeHandler",)
    guards = ("tests.core.base.test_module_check:LateLoansOnly",)


class LoanCountModule(Module):
    name = "loan-count"
    requires_core = ">=5,<6"
    dependencies = ("loans",)
    listeners = ("tests.core.base.test_commit_listener_runner:CountOverdue",)


class LoansTableRemoval(Migration):
    number = 0
    statements = ("DROP TABLE loans",)


class RemovableLoansModule(LoansModule):
    removal = "tests.core.base.sync_sample:LoansTableRemoval"
