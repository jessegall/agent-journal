import re
import time
from pathlib import Path

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.marks import action
from controllers.types import Environments, Messages
from features.secrets.resource import Kind, Secret, SecretField
from features.secrets.running import checked_program, run_masked
from features.secrets.sessions import BrowserLogins
from features.secrets.values import ValuesFile
from providers import PROVIDERS
from resources.base import AGENT, SYSTEM, USER, Refused

KEPT_DAYS = 30
PLACEHOLDER = re.compile(r"\{(\w+)\}")


class Secrets(Controller):
    resource = Secret

    @action
    def create(self, title: str, abstract: str = "", brief: str = "", kind: str = Kind.CUSTOM.value, **data) -> Secret:
        chosen = Kind.named(kind)
        return super().create(title, abstract, brief, kind=chosen.value, **{"secret_fields": chosen.fields(title), **data})

    @action
    def request(self, title: str, why: str, kind: str = Kind.API_KEY.value) -> Secret:
        row = self.create(title, kind=kind, asked=why)
        Messages(self.record, actor=AGENT).create(f"Please fill in the secret {title}", brief=f"I need it {why}. Fill it in on the Secrets page, never in the chat.\n\nsecret {row.n}")
        return row

    @action
    def fill(self, n: int, field: str, value: str) -> Secret:
        if self.actor != USER:
            self._refuse("only you fill in a secret's value, on the Secrets page in the viewer")
        return self._stored(self.load(n), field, value)

    @action
    def store(self, n: int, field: str, path: str) -> Secret:
        made = Path(path)
        if not made.is_file():
            raise Refused(f"no file at {path}: write the value you made to a file, and the journal moves it into the secret")
        value = made.read_text().strip()
        made.unlink()
        return self._stored(self.load(n), field, value)

    @action(here=True)
    def run(self, name: str, *command: str, stdin: str = "", env: bool = False) -> str:
        row = self._named(name)
        self._shared_with_caller(row)
        checked_program(command, row.programs)
        fields = [SecretField.from_json(raw) for raw in row.secret_fields]
        values = ValuesFile(self.record.root).values()
        if row.is_waiting() or any(field.variable not in values for field in fields):
            raise Refused(f"secret {row.n}, {row.title}, has no value yet: ask for it with journal secret request, and the user fills it in")
        by_name = {field.name: values[field.variable] for field in fields}
        given = PLACEHOLDER.sub(lambda found: by_name.get(found[1], found[0]), stdin) if stdin else next(values[field.variable] for field in fields if field.hidden)
        masks = {values[field.variable]: row.title for field in fields if field.hidden}
        code = run_masked(command, {field.variable: values[field.variable] for field in fields} if env else {}, masks, f"{given}\n".encode())
        self.update(row.n, used=time.time())
        if code:
            raise SystemExit(code)
        return ""

    @action(here=True)
    def login(self, name: str, url: str) -> str:
        row = self._named(name)
        logins = BrowserLogins(self.record.root)
        saved = logins.record(row.title, url)
        merged = logins.merge()
        rewired = [provider().browser_logins(self.record.root.parent, merged) for provider in PROVIDERS.values()]
        self.update(row.n, session=time.time(), session_expires=logins.expires(saved))
        restart = " Restart the agent once so its browser tool reads the saved logins." if any(rewired) else ""
        return f"saved: the agent's own browser starts logged in to {url} from its next start.{restart}"

    @action
    def where(self) -> str:
        return str(ValuesFile(self.record.root).path)

    def _stored(self, row: Secret, field: str, value: str) -> Secret:
        if not value:
            raise Refused("a secret's value cannot be empty")
        ValuesFile(self.record.root).put(row.field(field).variable, value)
        return self.update(row.n, filled={**row.filled, field: time.time()}, asked="")

    def _named(self, name: str) -> Secret:
        if name.isdigit():
            return self.load(int(name))
        found = next((row for row in self.rows.every() if row.title.lower() == name.lower()), None)
        if found is None:
            raise Refused(f"no secret named {name!r}: journal secret all lists them")
        return found

    def _shared_with_caller(self, row: Secret) -> None:
        place = Environments(self.record, actor=SYSTEM).rows.by_title(self.record.env)
        helping = bool(place and place.data.get("kind") == "helper")
        if not row.helpers and (self.agent or helping):
            raise Refused(f"secret {row.n}, {row.title}, is for the main agent only; the user can share it with helpers and subagents on the Secrets page")

    def _purge(self) -> list[str]:
        gone = [row for row in self.rows.every(deleted=True) if row.deleted and time.time() - row.deleted > KEPT_DAYS * 86400]
        variables = [raw["variable"] for row in gone for raw in row.secret_fields]
        if variables:
            ValuesFile(self.record.root).drop(variables)
        return variables


resources_module.register(Secret)
types_module.register(Secrets)
