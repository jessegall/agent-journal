from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.base.command.outside_runs import OutsideRuns
from core.base.command.outside_turn import OutsideTurn
from core.base.error_log import ErrorLog
from core.base.model.event_form import EventForm
from core.modules.plugins.support.plugin_code_faults import PLUGIN_CODE_FAULTS
from core.modules.plugins.support.plugin_event_answer import PluginEventAnswer
from core.modules.plugins.support.plugin_event_runner import PluginEventRunner
from core.modules.plugins.support.plugin_subscription import PluginSubscription


@dataclass(frozen=True)
class PluginEventWork:
    """The scripts a change is owed, run in install order once its transaction is over, stopping at a refusal. A
    failure of the journal's own plugin code goes to the error log and the change goes on."""

    runner: PluginEventRunner
    errors: ErrorLog
    form: EventForm
    key: str
    subscriptions: Sequence[PluginSubscription]
    data: Mapping[str, object]
    environment_id: int | None
    agent_id: int | None
    turn: OutsideTurn

    def label(self) -> str:
        return f"{self.form.value} scripts of {self.key}"

    def run(self, runs: OutsideRuns) -> None:
        answers: list[PluginEventAnswer] = []
        for subscription in self.subscriptions:
            answered = self.answered(subscription)
            if answered is None:
                continue
            answers.append(answered)
            if answered.answer.is_refusal():
                break
        runs.record(self.turn, tuple(answers))

    def answered(self, subscription: PluginSubscription) -> PluginEventAnswer | None:
        try:
            return self.runner.answer(subscription, self.form, self.key, self.data, self.environment_id, self.agent_id)
        except PLUGIN_CODE_FAULTS as error:
            self.errors.noted(f"the {self.label()} failed in {subscription.plugin}: {type(error).__name__}: {error}")
            return None
