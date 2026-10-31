from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class Template(Model):
    """A reusable shape for a task, a plan or a critique: a brief, the rows it applies to, its parts, and for a
    testing template the commands run at each phase end."""

    model_name = "template"
    cli_name = "template"

    creator_id: int
    title: str
    brief: str = ""
    targets: tuple[str, ...] = ()
    purpose: str = ""
    parts: tuple[str, ...] = ()
    commands: tuple[str, ...] = ()
