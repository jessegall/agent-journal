from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.environment_names import EnvironmentNames
from core.base.page import Page
from core.base.query.queries import Queries
from core.base.query.query import PAGE_SIZE_ROWS
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.viewer.models.person_preset import PersonPreset


class PersonPresetListSubcommand(ReadSubcommand[Page[PersonPreset]]):
    """`journal person-preset list --page <page>`: the layouts you saved as a preset for the page, in your
    environment or the one --environment names: the first page of them."""

    cli_name = "person-preset"
    name = "list"

    def __init__(self, queries: Queries, environment_names: EnvironmentNames) -> None:
        self.queries, self.environment_names = queries, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--page", required=True)
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> Page[PersonPreset]:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        return self.queries.query(PersonPreset).filter(environment_id=environment_id, person_id=caller.actor.id, page=arguments.page).page(1, PAGE_SIZE_ROWS)
