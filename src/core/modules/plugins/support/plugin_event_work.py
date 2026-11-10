import time
from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from engine.cli.caller_stream import CallerStream
from engine.command.outside_runs import OutsideRuns
from engine.command.outside_turn import OutsideTurn
from engine.enums.log_level import LogLevel
from engine.log.system_log_writer import SystemLogWriter
from engine.model.event_form import EventForm
from core.modules.plugins.support.plugin_code_faults import PLUGIN_CODE_FAULTS
from core.modules.plugins.support.plugin_event_answer import PluginEventAnswer
from core.modules.plugins.support.plugin_event_runner import PluginEventRunner
from core.modules.plugins.support.plugin_subscription import PluginSubscription


@dataclass(frozen=True)
class PluginEventWork:
    """Runs plugin scripts after the transaction and reports progress to the caller."""

    runner: PluginEventRunner
    system_log: SystemLogWriter
    caller: CallerStream
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
        started_at = time.monotonic()
        waiting = f"waiting on plugin {subscription.plugin} at {self.key}"

        def wait_callback() -> None:
            self.caller.line(f"{waiting}, for {int((time.monotonic() - started_at) / 60)} minutes")

        try:
            self.caller.line(waiting)
            return self.runner.answer(subscription, self.form, self.key, self.data, self.environment_id, self.agent_id, wait_callback)
        except BrokenPipeError:
            raise
        except PLUGIN_CODE_FAULTS as error:
            self.system_log.write(LogLevel.ERROR, f"the {self.label()} failed in {subscription.plugin}: {type(error).__name__}: {error}")
            return None
