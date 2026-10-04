
import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller, internal
from features.templates.resource import Template, TemplateField
from resources.base import Refused
from engine.wording import slugged


KINDS = ("text", "number", "choice")


class Templates(Controller):
    resource = Template

    @internal
    def chosen(self, given):
        if not given:
            return None
        try:
            return self.load(given)
        except (ValueError, Refused):
            raise Refused(f"template {given} does not exist: journal template all lists them") from None

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        self._known(data.get("applies_to"))
        return super().create(title, abstract, brief, **data)

    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None, **data):
        self._known(data.get("applies_to"))
        return super().update(n, title, abstract, brief, outcome, **data)

    def field(self, n: int, label: str, kind: str = "text", options: str = "", default: str = ""):
        if kind not in KINDS:
            self._refuse(f"a field is one of {', '.join(KINDS)}")
        choices = [option.strip() for option in options.split(",") if option.strip()]
        if kind == "choice" and not choices:
            self._refuse("a choice field needs --options \"one, two, three\"")
        name = slugged(label, "_")
        if not name:
            self._refuse("a field needs a label with a letter or a number in it")
        r = self.load(n)
        made = TemplateField(name, label.strip(), kind, tuple(choices), default)
        return self.update(r.n, fields=[f.to_json() for f in r.declared_fields if f.name != name] + [made.to_json()])

    def _known(self, given) -> None:
        names = [name.strip() for name in (given.split(",") if isinstance(given, str) else given or []) if name.strip()]
        unknown = [name for name in names if name not in resources_module.TYPES]
        if unknown:
            raise Refused(f"applies_to names types; {', '.join(unknown)} is not one: {', '.join(sorted(resources_module.TYPES))}")


resources_module.register(Template)
types_module.register(Templates)
