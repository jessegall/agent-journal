from journal.features.migration.project_kind import ProjectKind
from journal.features.migration.version_3_row import Version3Row
from journal.models.actor import Actor
from journal.models.secret import Secret
from journal.models.secret_kind import SecretKind
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.secrets import Secrets


class BringSecrets(ProjectKind):
    """A secret brings its name, how it is used, its kind, its fields and the programs the user allowed; never a value, which the user fills again on the Secrets page."""

    kind = "secret"
    title = "secrets"

    def __init__(self, ledger: MigratedRows, secrets: Secrets) -> None:
        super().__init__(ledger)
        self.secrets = secrets

    def made(self, row: Version3Row, by: Actor) -> Secret:
        kind = row.data.get("kind", "")
        fields = tuple({"name": f.get("name", ""), "hidden": bool(f.get("hidden")), "variable": f.get("variable", "")} for f in row.listed("secret_fields"))
        secret = Secret(title=row.title, brief=row.brief, kind=SecretKind(kind) if kind in {k.value for k in SecretKind} else SecretKind.CUSTOM, fields=fields, programs=tuple(row.listed("programs")))
        return self.secrets.imported(secret, row.made_at(), by)
