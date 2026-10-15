from journal.features.chart.entry import Entry
from journal.models.all_models import AllModels
from journal.models.node_kind import NodeKind
from journal.refused import Refused

AGENT_EVENTS = (
    ("session_started", "The session starts", "Claude or Codex starts or resumes a conversation here"),
    ("prompt_submitted", "A prompt is sent", "the user, or a typed line, sends the agent a prompt"),
    ("tool_starting", "A tool is about to run", "before a read, a write, a command or a dispatch; the moment a hold or a deny is possible"),
    ("tool_finished", "A tool finished", "after a tool ran, with its result"),
    ("idle", "The agent stops", "the agent ends its turn; the moment a stop can be blocked and the journal speaks"),
    ("turn_written", "The agent wrote for the user", "a turn of the agent's reaches the chat; Claude only"),
    ("subagent_started", "A subagent starts", "the agent dispatched a subagent"),
    ("subagent_ended", "A subagent ends", "a subagent reported back"),
    ("compacting", "The context compacts", "the conversation is about to be summarised"),
    ("session_ended", "The session ends", "the agent's process is gone"),
    ("ticked", "The clock ticks", "every few seconds for each live agent"),
)
CHECKS = (
    ("open_tasks", "Open tasks?", "the environment has open tasks the agent may take up, outside a plan not yet started"),
    ("task_in_hand", "A task in hand?", "the agent has a task started"),
    ("work_declared", "Work declared?", "the agent declared work without a task"),
    ("parked_tasks", "Parked tasks?", "a task is parked"),
    ("blocked_tasks", "Blocked tasks?", "a task waits on something outside"),
    ("unread_messages", "Unread messages?", "the user left a message the agent has not read"),
    ("unanswered_messages", "Unanswered messages?", "a message was read and not yet replied to or given a face"),
    ("auto_mode", "Auto mode on?", "the environment runs in auto mode"),
    ("same_stop_again", "The same stop again?", "this stop was already refused once and nothing happened since"),
    ("following_plan", "Following a plan?", "the agent is on a plan's task"),
    ("tool_writes", "The tool writes?", "the tool about to run changes a file or runs a writing command"),
    ("journal_command", "A journal command?", "the tool about to run is a journal command"),
    ("running_sequence", "In a sequence?", "the agent is on a step of a sequence"),
)
ACTIONS = (
    ("say", "Say a line", "the line is said to the agent through the nudger, once per repeat window", True),
    ("hold", "Hold the tool", "the tool use is refused with the line, until what the line names is done", True),
    ("block_stop", "Block the stop", "the stop is refused with the line; the agent carries on", True),
    ("type", "Type a line", "the line is typed into the agent's terminal as its next prompt", True),
    ("start_sequence", "Start a sequence", "the sequence of this title starts at its first step", True),
)


class Catalogue:
    """Everything a node may be: a trigger for each agent event and each row event, the checks the journal can answer, and the actions it can take."""

    def triggers(self) -> list[Entry]:
        agent = [Entry(NodeKind.TRIGGER, key, title, about, providers=("claude",) if key == "turn_written" else ("claude", "codex")) for key, title, about in AGENT_EVENTS]
        rows = [Entry(NodeKind.TRIGGER, f"{model.table()}.{moment}", f"A {model.__name__.lower()} is {moment}", f"a row of {model.table()} is {moment} by anyone")
                for model in AllModels.MODELS for moment in ("created", "updated", "deleted")]
        return agent + rows

    def checks(self) -> list[Entry]:
        return [Entry(NodeKind.CHECK, key, title, about) for key, title, about in CHECKS]

    def actions(self) -> list[Entry]:
        return [Entry(NodeKind.ACTION, key, title, about, takes_text) for key, title, about, takes_text in ACTIONS]

    def all(self) -> list[Entry]:
        return self.triggers() + self.checks() + self.actions()

    def has(self, kind: str, key: str) -> bool:
        return any(entry.kind == kind and entry.key == key for entry in self.all())

    def entry(self, kind: NodeKind, key: str) -> Entry:
        for entry in self.all():
            if entry.kind == kind and entry.key == key:
                return entry
        raise Refused(f"the catalogue has no {kind} named {key}")
