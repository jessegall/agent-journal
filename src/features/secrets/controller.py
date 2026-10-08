import time
from pathlib import Path

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.marks import action
from controllers.types import Messages
from features.secrets.resource import Kind, Secret
from features.secrets.values import ValuesFile
from resources.base import AGENT, USER, Refused

KEPT_DAYS = 30


class Secrets(Controller):
    resource = Secret

    @action
    def create(self, title: str, abstract: str = "", brief: str = "", kind: str = Kind.CUSTOM.value, **data) -> Secret:
        chosen = Kind.named(kind)
        return super().create(title, abstract, brief, kind=chosen.value, **{"secret_fields": chosen.fields(title), **data})

    @action
    def request(self, title: str, why: str, kind: str = Kind.API_KEY.value) -> Secret:
        row = self.create(title, kind=kind, asked=why)
        Messages(self.record, actor=AGENT).create(f"Please fill in the secret {title}", brief=f"I need it {why}. Fill it in under Settings, Secrets, never in the chat.\n\nsecret {row.n}")
        return row

    @action
    def fill(self, n: int, field: str, value: str) -> Secret:
        if self.actor != USER:
            self._refuse("only you fill in a secret's value, under Settings, Secrets in the viewer")
        return self._stored(self.load(n), field, value)

    @action
    def store(self, n: int, field: str, path: str) -> Secret:
        made = Path(path)
        if not made.is_file():
            raise Refused(f"no file at {path}: write the value you made to a file, and the journal moves it into the secret")
        value = made.read_text().strip()
        made.unlink()
        return self._stored(self.load(n), field, value)

    @action
    def where(self) -> str:
        return str(ValuesFile(self.record.root).path)

    def _stored(self, row: Secret, field: str, value: str) -> Secret:
        if not value:
            raise Refused("a secret's value cannot be empty")
        ValuesFile(self.record.root).put(row.field(field).variable, value)
        return self.update(row.n, filled={**row.filled, field: time.time()}, asked="")

    def _purge(self) -> list[str]:
        gone = [row for row in self.rows.every(deleted=True) if row.deleted and time.time() - row.deleted > KEPT_DAYS * 86400]
        variables = [raw["variable"] for row in gone for raw in row.secret_fields]
        if variables:
            ValuesFile(self.record.root).drop(variables)
        return variables


resources_module.register(Secret)
types_module.register(Secrets)
