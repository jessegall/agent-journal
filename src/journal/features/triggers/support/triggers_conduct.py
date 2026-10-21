from journal.engine.conduct import Conduct
from journal.engine.nudge import Nudge
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.message_arrived import MessageArrived
from journal.models.trigger import Trigger
from journal.models.trigger_action import TriggerAction


class TriggersConduct(Conduct):
    """The triggers feature's conduct in every state: the triggers a prompt, a message or a tool call's input meets are said as their action names, a nudge or an instruction, and a tool a trigger denies is held; a sequence a trigger starts is the listener's, with its first step."""

    def on_prompt_submitted_triggers(self, event: PromptSubmitted, settings: Settings) -> Transition:
        from journal.features.triggers.feature import Triggers
        return self.unchanged(*lines_for(triggers_met(event.snapshot.of(Triggers).triggers, event.prompt)))

    def on_message_arrived_triggers(self, event: MessageArrived, settings: Settings) -> Transition:
        from journal.features.triggers.feature import Triggers
        return self.unchanged(*lines_for(triggers_met(event.snapshot.of(Triggers).triggers, event.text)))

    def on_tool_starting_triggers(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.triggers.feature import Triggers
        rows = triggers_met(event.snapshot.of(Triggers).triggers, event.call.input_text)
        denied = [t for t in rows if t.action == TriggerAction.DENY]
        if denied:
            return self.hold(Triggers.DENIED.create(title=denied[0].text))
        return self.unchanged(*lines_for(rows))


def triggers_met(triggers: tuple[Trigger, ...], text: str) -> list[Trigger]:
    return [trigger for trigger in triggers if trigger.met_by(text)]


def lines_for(triggers: list[Trigger]) -> list[Nudge]:
    from journal.features.triggers.feature import Triggers
    return [(Triggers.INSTRUCT if trigger.action == TriggerAction.INSTRUCT else Triggers.NUDGE).create(title=trigger.text) for trigger in triggers if trigger.action != TriggerAction.SEQUENCE]
