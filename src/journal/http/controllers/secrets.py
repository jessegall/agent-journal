from datetime import datetime, timezone

from journal.features.secrets.login_window import LoginWindow
from journal.features.secrets.programs import Programs
from journal.http.controllers.controller import Controller
from journal.http.request import Request
from journal.http.response import Response
from journal.models.secret import Secret
from journal.models.secret_kind import SecretKind
from journal.support.refused import Refused
from journal.support.scope import Scope
from journal.repositories.secrets import Secrets
from journal.support.secret_values import SecretValues


class SecretController(Controller[Secret]):
    """What the Secrets page does to a secret: make it, change it, fill a value, delete, restore, and log in or stop a login. A value goes straight to the values file and never into the row, which is all the page ever reads."""

    def __init__(self, secrets: Secrets, values: SecretValues, window: LoginWindow, scope: Scope) -> None:
        self.repository, self.values, self.window, self.scope = secrets, values, window, scope

    def is_open(self, row: Secret) -> bool:
        return row.deleted_at is None

    def store(self, request: Request) -> Response:
        body = request.body
        kind, title = SecretKind.named(body.get("kind") or SecretKind.CUSTOM.value), str(body.get("title", "")).strip()
        secret = Secret(title=title, brief=body.get("brief", ""), kind=kind, fields=tuple(body.get("fields") or kind.first_fields(title)),
                        programs=self.allowed(body.get("programs", ())), helpers=bool(body.get("helpers")))
        return Response.json(self.repository.save(secret, request.actor), 201)

    def update(self, request: Request) -> Response:
        secret, body = self.repository.find(request.number("id")), request.body
        programs = self.allowed(body["programs"]) if "programs" in body else None
        proposed = tuple(body["proposed"]) if "proposed" in body else None
        changes = {name: (tuple(body[name]) if name == "fields" else body[name]) for name in ("title", "brief", "fields", "helpers") if name in body}
        return Response.json(self.repository.save(secret.allowing(programs, proposed).with_(**changes), request.actor))

    def fill(self, request: Request) -> Response:
        secret, value = self.repository.find(request.number("id")), str(request.body.get("value", ""))
        if not value:
            raise Refused("an empty value is no value: type it in, or leave the field as it is")
        field = str(request.body.get("field", ""))
        self.values.put(secret.field(field).variable, value)
        return Response.json(self.repository.save(secret.filled_in(field), request.actor))

    def delete(self, request: Request) -> Response:
        return Response.json(self.repository.save(self.repository.find(request.number("id")).deleted(datetime.now(timezone.utc)), request.actor))

    def restore(self, request: Request) -> Response:
        return Response.json(self.repository.save(self.repository.find(request.number("id")).restored(), request.actor))

    def login(self, request: Request) -> Response:
        return Response.json(self.window.open(self.repository.find(request.number("id")), self.scope.id, request.actor))

    def allow_login(self, request: Request) -> Response:
        """The agent may log in to this site on its own from now on, and a login is taken now."""
        secret = self.repository.save(self.repository.find(request.number("id")).with_(auto_login=True), request.actor)
        return Response.json(self.window.open(secret, self.scope.id, request.actor))

    def revoke_login(self, request: Request) -> Response:
        """The agent asks with a Log in button again; the saved login stays."""
        return Response.json(self.repository.save(self.repository.find(request.number("id")).with_(auto_login=False), request.actor))

    def forget_login(self, request: Request) -> Response:
        """The saved login deleted and taken from the agent's browser."""
        return Response.json(self.window.forgotten(self.repository.find(request.number("id")), request.actor))

    def where(self, request: Request) -> Response:
        return Response.json({"path": str(self.values.path)})

    @staticmethod
    def allowed(programs) -> tuple[str, ...]:
        """The programs a secret may go to, by name; one never given is refused."""
        refused = [p for p in programs if Programs.never_given(p)]
        if refused:
            raise Refused(f"a secret is never given to {', '.join(refused)}: allow the program that uses it directly, such as curl or gh")
        return tuple(dict.fromkeys(programs))
