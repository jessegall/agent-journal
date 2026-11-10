from engine.event.changed import Changed
from engine.guard.errors.guard_refusal import SKIP_ALLOWED_CASE
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.enums.event_form import EventForm
from engine.model.model import Model
from engine.errors.refusal import Refusal
from core.modules.plugins.support.plugin_event_scripts import GUARD_NAME, PluginEventScripts


class PluginEventGuard(Guard[Changed[Model]]):
    """Checks a change against plugin guard scripts."""

    name = GUARD_NAME
    runs_last = True
    is_safety = True

    def __init__(self, scripts: PluginEventScripts) -> None:
        self.scripts = scripts

    def check(self, event: Changed[Model], context: Context) -> None:
        answers = self.scripts.answers(EventForm.GUARD, event, context)
        for answered in answers:
            if answered.answer.is_refusal():
                skip = f"; {SKIP_ALLOWED_CASE}: --skip-guard {GUARD_NAME}:{answered.plugin} --skip-reason <why it is wrong here>" if answered.allows_skip else ""
                raise Refusal(f"[plugin {answered.plugin}] {answered.answer.reason} (journal plugin disable {answered.plugin} lets it through{skip})")
        for answered in answers:
            self.scripts.apply(answered, context)
