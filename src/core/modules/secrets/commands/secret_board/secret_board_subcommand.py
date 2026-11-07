from argparse import Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.secrets.commands.secret_list.secret_list_subcommand import SecretListSubcommand
from core.modules.secrets.models.secret import Secret
from core.modules.secrets.queries.secret_query import SecretQuery
from core.modules.secrets.support.secret_board import SecretBoard


class SecretBoardSubcommand(ReadSubcommand[SecretBoard]):
    """Lists active and deleted secrets together."""

    cli_name = "secret"
    name = "board"

    def __init__(self, secrets: SecretQuery) -> None:
        self.secrets = secrets

    def read(self, arguments: Namespace, caller: Caller) -> SecretBoard:
        return SecretBoard(tuple(self.secrets.active().oldest().all_rows()), tuple(self.secrets.deleted().oldest().all_rows()))

    def write_output(self, value: object, output: Output) -> None:
        assert isinstance(value, SecretBoard)
        output.write("\n".join(SecretListSubcommand.line(row) for row in value.active) or "no secrets yet", {
            "rows": [self.values(row, output) for row in value.active], "deleted": [self.values(row, output) for row in value.deleted],
        })

    @staticmethod
    def values(secret: Secret, output: Output) -> dict[str, object]:
        return {**output.values(secret), "waiting": secret.is_waiting()}
