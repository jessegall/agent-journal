import json
from dataclasses import asdict, fields
from datetime import datetime, timezone

from journal.events.agent.agent_event import AgentEvent
from journal.events.event import Event
from journal.support.tool_call import ToolCall
from journal.events.models.model_event import ModelEvent
from journal.events.models.updated import Updated
from journal.features.plugins.support.plugin_fault import PluginFault
from journal.features.plugins.support.plugin_answer import PluginAnswer
from journal.features.plugins.support.plugin_card import PluginCard

ANSWERS = ("allow", "refuse", "tell")
MOST_COMMANDS = 20
PLACED = ("session", "environment_id", "provider", "context", "subagent", "time", "readings")


class Protocol:
    """The one line the journal sends a plugin for an event, and the one line it reads back: JSON both ways, versioned."""

    VERSION = 1

    def line_of(self, event: Event, environment: str, state: str = "") -> str:
        line = {"v": self.VERSION, "event": event.key, "at": datetime.now(timezone.utc).isoformat(), "environment": environment, "state": state, "data": self.data_of(event)}
        if isinstance(event, AgentEvent):
            line |= {"session": event.session, "provider": event.provider, "subagent": event.subagent}
        return json.dumps(line, default=str)

    @staticmethod
    def data_of(event: Event) -> dict:
        if isinstance(event, ModelEvent):
            row = {"table": event.model.table(), "id": event.model.id, "by": event.actor.stamp}
            return row | {"changed": list(event.changed())} if isinstance(event, Updated) else row
        data = {}
        for name, value in ((f.name, getattr(event, f.name)) for f in fields(event) if f.name not in PLACED):
            data |= asdict(value) if isinstance(value, ToolCall) else {name: value}
        return data

    def answer_of(self, text: str) -> PluginAnswer:
        if not text.strip():
            return PluginAnswer()
        try:
            raw = json.loads(text.strip().splitlines()[-1])
        except json.JSONDecodeError as broken:
            raise PluginFault(f"its answer is not JSON: {broken}") from broken
        if not isinstance(raw, dict):
            raise PluginFault("its answer is not a JSON object")
        unknown = sorted(set(raw) - {f.name for f in fields(PluginAnswer)})
        if unknown:
            raise PluginFault(f"its answer has keys the protocol does not know: {', '.join(unknown)}")
        answer = PluginAnswer(**{**raw, "cards": tuple(PluginCard.from_json(card) for card in raw.get("cards", ())), "commands": tuple(raw.get("commands", ()))})
        if answer.answer not in ANSWERS:
            raise PluginFault(f"it answered {answer.answer!r}; an answer is allow, refuse or tell")
        if answer.v != self.VERSION:
            raise PluginFault(f"it answered in protocol {answer.v}; this journal speaks {self.VERSION}")
        if len(answer.commands) > MOST_COMMANDS:
            raise PluginFault(f"it asked for {len(answer.commands)} commands; one answer runs at most {MOST_COMMANDS}")
        return answer
