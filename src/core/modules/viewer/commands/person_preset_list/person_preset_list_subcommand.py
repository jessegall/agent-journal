from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
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

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--page", required=True)

    def read(self, arguments: Namespace, caller: Caller) -> Page[PersonPreset]:
        return self.queries.query(PersonPreset).filter(person_id=caller.actor.id, page=arguments.page).page(1, PAGE_SIZE_ROWS)
