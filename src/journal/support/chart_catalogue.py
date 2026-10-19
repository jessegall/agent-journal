from journal.support.entry import Entry
from journal.features.registry import Registry
from journal.support.all_models import AllModels
from journal.models.node_kind import NodeKind
from journal.support.refused import Refused

FORMER_TITLES = {"Session start": "Session starts", "User prompt submit": "Prompt sent", "Pre tool use": "Tool about to run", "Post tool use": "Tool finished", "Stop": "Agent stops", "Message display": "Agent writes to you", "Subagent start": "Subagent starts", "Subagent stop": "Subagent ends", "Pre compact": "Context compacts", "Session end": "Session ends", "Tick": "Clock ticks"}
"""The agent events' titles before they took the providers' hook names: a shipped workflow still titled by one is retitled at boot."""
AGENT_EVENTS = (
    ("session_started", "Session start", "Claude or Codex starts or resumes a conversation here"),
    ("prompt_submitted", "User prompt submit", "you, or a typed line, send the agent a prompt"),
    ("tool_starting", "Pre tool use", "before a read, a write, a command or a dispatch; where a tool can be held or denied"),
    ("tool_finished", "Post tool use", "after a tool ran, with its result"),
    ("idle", "Stop", "the agent finishes responding; where the stop can be blocked or the journal can speak"),
    ("turn_written", "Message display", "a turn of the agent's reaches the chat; Claude only"),
    ("subagent_started", "Subagent start", "the agent dispatched a subagent"),
    ("subagent_ended", "Subagent stop", "a subagent reported back"),
    ("compacting", "Pre compact", "the conversation is about to be summarised"),
    ("session_ended", "Session end", "the agent's process is gone"),
    ("ticked", "Tick", "every few seconds for each live agent"),
)
OWN = ("agents", "entries", "links", "counts")
"""The engine's own tables, which a walk writes itself when it moves an agent, records itself, draws a line or counts: a trigger on them would walk without end, so no workflow may name them."""


class ChartCatalogue:
    """Everything a node may be: a trigger for each agent event and each row event, and the checks and actions the features declare, gathered here and defined nowhere else."""

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def triggers(self) -> list[Entry]:
        agent = [Entry(NodeKind.TRIGGER, key, title, about, providers=("claude",) if key == "turn_written" else ("claude", "codex")) for key, title, about in AGENT_EVENTS]
        rows = [Entry(NodeKind.TRIGGER, f"{model.table()}.{moment}", f"{model.noun()[0].upper()}{model.noun()[1:]} {moment}", f"a row of {model.table()} is {moment} by anyone", group=model.noun())
                for model in AllModels.MODELS if model.table() not in OWN for moment in ("created", "updated", "deleted")]
        return agent + rows

    def checks(self) -> list[Entry]:
        return [entry for feature in self.registry.features for entry in feature.checks]

    def actions(self) -> list[Entry]:
        return [entry for feature in self.registry.features for entry in feature.actions]

    def all(self) -> list[Entry]:
        return self.triggers() + self.checks() + self.actions()

    def has(self, kind: str, key: str) -> bool:
        return any(entry.is_(kind, key) for entry in self.all())

    def entry(self, kind: NodeKind, key: str) -> Entry:
        for entry in self.all():
            if entry.is_(kind, key):
                return entry
        raise Refused(f"the catalogue has no {kind} named {key}")
