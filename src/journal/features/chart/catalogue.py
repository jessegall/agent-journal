from journal.features.entry import Entry
from journal.features.registry import Registry
from journal.models.all_models import AllModels
from journal.models.node_kind import NodeKind
from journal.refused import Refused

AGENT_EVENTS = (
    ("session_started", "Session starts", "Claude or Codex starts or resumes a conversation here"),
    ("prompt_submitted", "Prompt sent", "you, or a typed line, send the agent a prompt"),
    ("tool_starting", "Tool about to run", "before a read, a write, a command or a dispatch; where a tool can be held or denied"),
    ("tool_finished", "Tool finished", "after a tool ran, with its result"),
    ("idle", "Agent stops", "the agent finishes responding; where the stop can be blocked or the journal can speak"),
    ("turn_written", "Agent writes to you", "a turn of the agent's reaches the chat; Claude only"),
    ("subagent_started", "Subagent starts", "the agent dispatched a subagent"),
    ("subagent_ended", "Subagent ends", "a subagent reported back"),
    ("compacting", "Context compacts", "the conversation is about to be summarised"),
    ("session_ended", "Session ends", "the agent's process is gone"),
    ("ticked", "Clock ticks", "every few seconds for each live agent"),
)
def article(words: str) -> str:
    """A or An before the words, by their first sound: an edit, an MCP server, a task."""
    first = words.split(" ")[0]
    return "An" if first[0].lower() in "aeiou" or (first.isupper() and first[0] in "AEFHILMNORSX") else "A"


OWN = ("agents", "entries", "links", "counts")
"""The engine's own tables, which a walk writes itself when it moves an agent, records itself, draws a line or counts: a trigger on them would walk without end, so no workflow may name them."""


class Catalogue:
    """Everything a node may be: a trigger for each agent event and each row event, and the checks and actions the features declare, gathered here and defined nowhere else."""

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def triggers(self) -> list[Entry]:
        agent = [Entry(NodeKind.TRIGGER, key, title, about, providers=("claude",) if key == "turn_written" else ("claude", "codex")) for key, title, about in AGENT_EVENTS]
        rows = [Entry(NodeKind.TRIGGER, f"{model.table()}.{moment}", f"{article(model.noun())} {model.noun()} is {moment}", f"a row of {model.table()} is {moment} by anyone", group=model.noun())
                for model in AllModels.MODELS if model.table() not in OWN for moment in ("created", "updated", "deleted")]
        return agent + rows

    def checks(self) -> list[Entry]:
        return [entry for feature in self.registry.features for entry in feature.checks]

    def actions(self) -> list[Entry]:
        return [entry for feature in self.registry.features for entry in feature.actions]

    def all(self) -> list[Entry]:
        return self.triggers() + self.checks() + self.actions()

    def has(self, kind: str, key: str) -> bool:
        return any(entry.kind == kind and entry.key == key for entry in self.all())

    def entry(self, kind: NodeKind, key: str) -> Entry:
        for entry in self.all():
            if entry.kind == kind and entry.key == key:
                return entry
        raise Refused(f"the catalogue has no {kind} named {key}")
