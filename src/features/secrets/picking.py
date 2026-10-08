from features.secrets.controller import Secrets
from features.secrets.resource import SecretField
from resources.base import Refused, SYSTEM


def refuse_secret_that_runs_commands(record, name: str, variable: str) -> None:
    """A secret that lets commands use it is not picked as the key of a feature, which is for that feature alone."""
    for secret in Secrets(record, actor=SYSTEM).rows.standing():
        if secret.programs and any(SecretField.from_json(raw).variable == variable for raw in secret.secret_fields):
            raise Refused(f"the secret {secret.title} lets commands use it, so it cannot be the key of {name}; make one for {name} alone, with no command")
