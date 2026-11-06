from core.base.change.changed import Changed
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.model.event_form import EventForm
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.plugins.support.plugin_event_scripts import PluginEventScripts


class PluginEventGuard(Guard[Changed[Model]]):
    """A change passes the guard scripts of the plugins on its key: a script that refuses stops it, and what an
    allowing script tells or shows rolls back with the change."""

    name = "plugins.event-guard"
    runs_last = True

    def __init__(self, scripts: PluginEventScripts) -> None:
        self.scripts = scripts

    def check(self, event: Changed[Model], context: Context) -> None:
        answers = self.scripts.answers(EventForm.GUARD, event, context)
        for answered in answers:
            if answered.answer.is_refusal():
                raise Refusal(f"[plugin {answered.plugin}] {answered.answer.reason}", f"journal plugin disable {answered.plugin} lets it through")
        for answered in answers:
            self.scripts.apply(answered, context)
