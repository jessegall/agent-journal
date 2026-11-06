from core.base.change.changed import Changed
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.model.event_form import EventForm
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.plugins.support.plugin_event_scripts import GUARD_NAME, PluginEventScripts


class PluginEventGuard(Guard[Changed[Model]]):
    """A change passes the guard scripts of the plugins on its key: a script that refuses stops it, and what an
    allowing script tells or shows rolls back with the change. It is skipped for one plugin at a time, by name, and
    the bare name passes nothing."""

    name = GUARD_NAME
    runs_last = True
    is_safety = True

    def __init__(self, scripts: PluginEventScripts) -> None:
        self.scripts = scripts

    def check(self, event: Changed[Model], context: Context) -> None:
        answers = self.scripts.answers(EventForm.GUARD, event, context)
        for answered in answers:
            if answered.answer.is_refusal():
                skip = f"; to pass it: --skip-guard {GUARD_NAME}:{answered.plugin} --skip-reason <why>" if answered.allows_skip else ""
                raise Refusal(f"[plugin {answered.plugin}] {answered.answer.reason} (journal plugin disable {answered.plugin} lets it through{skip})")
        for answered in answers:
            self.scripts.apply(answered, context)
