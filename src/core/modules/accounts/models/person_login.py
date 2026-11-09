from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class PersonLogin(Model):
    """The name and password digest a person logs in to a hosted journal with."""

    model_name = "person_login"
    cli_name = "person-login"
    hidden_fields = frozenset({"password_digest"})

    creator_id: int
    person_id: int
    name: str
    password_digest: str
