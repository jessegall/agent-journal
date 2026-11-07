from argparse import ArgumentParser, Namespace

from core.base.query.queries import Queries
from core.base.scope.scopes import Scopes
from core.base.refusal import Refusal
from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.environments.models.environment import Environment
from core.modules.drivers.commands.support.suite_run import SuiteRun


class SuiteCurrentSubcommand(ReadSubcommand[SuiteRun]):
    """`journal suite current <environment>`: the suite the environment runs and the driver of each role."""

    cli_name = "suite"
    name = "current"

    def __init__(self, choice: SuiteChoice, queries: Queries, scopes: Scopes) -> None:
        self.choice, self.queries, self.scopes = choice, queries, scopes

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("environment")

    def read(self, arguments: Namespace, caller: Caller) -> SuiteRun:
        environment = self.queries.query(Environment).filter(name=arguments.environment).first()
        if environment is None:
            raise Refusal(f"no environment is called {arguments.environment}", "see every environment with journal environment list")
        with self.scopes.read_scope((), None, environment.id):
            return self.suite_run()

    def suite_run(self) -> SuiteRun:
        suite = self.choice.suite()
        if suite is None:
            return SuiteRun.unset(self.choice.suite_names())
        drivers = [f"{role}: {driver.name}" for role in suite.defaults if (driver := self.choice.driver(role)) is not None]
        return SuiteRun(suite.name, ", ".join(drivers))
