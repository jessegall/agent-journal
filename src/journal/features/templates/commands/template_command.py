from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.models.template import Template
from journal.repositories.templates import Templates


class TemplateCommand(Command):
    noun = "template"

    def __init__(self, templates: Templates) -> None:
        self.templates = templates

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "write a template")
        create.add_argument("title")
        create.add_argument("--brief", default="", help="the instructions read before working on anything made from it")
        create.add_argument("--applies-to", default="", help="the kinds of row it is for, comma-separated, such as plan; empty means any")
        create.add_argument("--purpose", default="", help="what it is used for, such as critique")
        create.add_argument("--parts", default="", help="the outline a new item starts with: title: body | title: body")
        self.verb(verbs, "show", "a template's instructions and outline").add_argument("n", type=int)
        self.verb(verbs, "list", "every template")

    def create(self, args: Namespace, where: Where) -> int:
        applies = tuple(k.strip() for k in args.applies_to.split(",") if k.strip())
        parts = tuple(p.strip() for p in args.parts.split("|") if p.strip())
        template = self.templates.save(Template(title=args.title, applies_to=applies, purpose=args.purpose, brief=args.brief, parts=parts), where.actor)
        print(f"template {template.id}: {template.title}")
        return 0

    def show(self, args: Namespace, where: Where) -> int:
        template = self.templates.find(args.n)
        kinds = ", ".join(template.applies_to) or "any row"
        print(f"template {template.id}: {template.title} (for {kinds}{', ' + template.purpose if template.purpose else ''})")
        print(template.brief)
        for part in template.parts:
            print(f"- {part}")
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for template in self.templates.all():
            kinds = ", ".join(template.applies_to) or "any"
            print(f"{template.id:>4}  {template.title} (for {kinds}{', ' + template.purpose if template.purpose else ''})")
        return 0
