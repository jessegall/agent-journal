import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from features.templates.resource import Template
from resources.base import Refused


class Templates(Controller):
    resource = Template

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        self._known(data.get("applies_to"))
        return super().create(title, abstract, brief, **data)

    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None, **data):
        self._known(data.get("applies_to"))
        return super().update(n, title, abstract, brief, outcome, **data)

    def _known(self, given) -> None:
        names = [name.strip() for name in (given.split(",") if isinstance(given, str) else given or []) if name.strip()]
        unknown = [name for name in names if name not in resources_module.TYPES]
        if unknown:
            raise Refused(f"applies_to names types; {', '.join(unknown)} is not one: {', '.join(sorted(resources_module.TYPES))}")


resources_module.register(Template)
types_module.register(Templates)
