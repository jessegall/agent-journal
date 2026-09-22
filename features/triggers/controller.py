import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller, internal
from features.triggers.resource import DOES, Trigger
from resources.base import Refused, Resource


class Triggers(Controller):
    resource = Trigger

    @internal
    def save(self, r: Resource, action: str, **event) -> Resource:
        if str(r.does) not in DOES:
            raise Refused(f"a trigger does one of {', '.join(DOES)}, not {r.does!r}")
        if not r.words:
            raise Refused('a trigger needs words to watch for: --set words="one,two"')
        return super().save(r, action, **event)


resources_module.register(Trigger)
types_module.register(Triggers)
