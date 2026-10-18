from datetime import datetime, timezone

from journal.features.secrets.login_window import LoginWindow
from journal.features.secrets.programs import Programs
from journal.http.v3.action_body import ActionBody
from journal.models.actor import Actor
from journal.models.secret import Secret
from journal.models.secret_kind import SecretKind
from journal.refused import Refused
from journal.repositories.scope import Scope
from journal.repositories.secrets import Secrets
from journal.secret_values import SecretValues


class SecretActions:
    """What the Secrets page does to a secret: make it, change it, fill a value, delete, restore and stop a login. A value goes straight to the values file and never into the row."""

    def __init__(self, secrets: Secrets, values: SecretValues, window: LoginWindow, scope: Scope) -> None:
        self.secrets, self.values, self.window, self.scope = secrets, values, window, scope

    def create(self, body: ActionBody, by: Actor) -> Secret:
        kind = SecretKind.named(body.kind or SecretKind.CUSTOM.value)
        title = body.title.strip()
        fields = body.secret_fields or kind.first_fields(title)
        return self.secrets.save(Secret(title=title, brief=body.brief, kind=kind, fields=fields, programs=self.allowed(body.programs), helpers=body.helpers), by)

    def update(self, n: int, body: ActionBody, by: Actor) -> Secret:
        secret = self.secrets.find(n)
        programs = self.allowed(body.programs) if body.has("programs") else None
        proposed = body.proposed if body.has("proposed") else None
        return self.secrets.save(secret.allowing(programs, proposed).with_(**body.changes(title="title", brief="brief", fields="secret_fields", helpers="helpers")), by)

    def fill(self, n: int, body: ActionBody, by: Actor) -> Secret:
        secret = self.secrets.find(n)
        if not body.value:
            raise Refused("an empty value is no value: type it in, or leave the field as it is")
        self.values.put(secret.field(body.field).variable, body.value)
        return self.secrets.save(secret.filled_in(body.field), by)

    def delete(self, n: int, body: ActionBody, by: Actor) -> Secret:
        return self.secrets.save(self.secrets.find(n).deleted(datetime.now(timezone.utc)), by)

    def restore(self, n: int, body: ActionBody, by: Actor) -> Secret:
        return self.secrets.save(self.secrets.find(n).restored(), by)

    def login(self, n: int, body: ActionBody, by: Actor) -> Secret:
        return self.window.open(self.secrets.find(n), self.scope.id, by)

    def allow_login(self, n: int, body: ActionBody, by: Actor) -> Secret:
        """The agent may log in to this site on its own from now on, and a login is taken now."""
        return self.window.open(self.secrets.save(self.secrets.find(n).with_(auto_login=True), by), self.scope.id, by)

    def revoke_login(self, n: int, body: ActionBody, by: Actor) -> Secret:
        """The agent asks with a Log in button again; the saved login stays."""
        return self.secrets.save(self.secrets.find(n).with_(auto_login=False), by)

    def forget_login(self, n: int, body: ActionBody, by: Actor) -> Secret:
        """The saved login deleted and taken from the agent's browser."""
        return self.window.forgotten(self.secrets.find(n), by)

    def read(self, n: int, body: ActionBody, by: Actor) -> Secret:
        return self.secrets.find(n)

    def where(self) -> str:
        return str(self.values.path)

    @staticmethod
    def allowed(programs) -> tuple[str, ...]:
        """The programs a secret may go to, by name; one never given is refused."""
        refused = [p for p in programs if Programs.never_given(p)]
        if refused:
            raise Refused(f"a secret is never given to {', '.join(refused)}: allow the program that uses it directly, such as curl or gh")
        return tuple(dict.fromkeys(programs))
