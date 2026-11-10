from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.provider.providers import Providers
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.subcommand.row_list import RowList
from core.modules.helpers.support.allowed_models import AllowedModels


class WorkerModelsSubcommand(ReadSubcommand[RowList]):
    """`journal worker models`: each program's models from the cheapest to the strongest, and whether a worker
    may run on it."""

    cli_name = "worker"
    name = "models"

    def __init__(self, providers: Providers, models: AllowedModels) -> None:
        self.providers, self.models = providers, models

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        return RowList([{"id": f"{provider.name} {model.name}", "program": provider.name, "title": provider.title, "model": model.name, "tier": model.tier.value,
                         "allowed": model.name in self.models.allowed(provider)}
                        for provider in self.providers.all() for model in provider.models])

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RowList):
            output.write("\n".join(f"{row['id']}: {'allowed' if row['allowed'] else 'not allowed'}" for row in value.rows), value.json())
