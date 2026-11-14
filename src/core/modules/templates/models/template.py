from dataclasses import dataclass

from engine.model.model import Model
from engine.actor.actor import CORE_ACTOR_ID
from engine.template.template_declaration import TemplateDeclaration


@dataclass(frozen=True, kw_only=True)
class Template(Model):
    """A reusable shape for a task, a plan or a critique: a brief, the rows it applies to, its parts, and for
    a testing template the commands run at each phase end."""

    model_name = "template"
    cli_name = "template"
    search_fields = ["title", "brief", "purpose"]

    creator_id: int
    title: str
    brief: str = ""
    targets: tuple[str, ...] = ()
    purpose: str = ""
    parts: tuple[str, ...] = ()
    commands: tuple[str, ...] = ()
    module: str = ""

    @classmethod
    def build(cls, declaration: TemplateDeclaration, module: str) -> "Template":
        return cls(creator_id=CORE_ACTOR_ID, title=declaration.title, brief=declaration.brief, targets=declaration.targets,
                   purpose=declaration.purpose, parts=declaration.parts, commands=declaration.commands, module=module)
