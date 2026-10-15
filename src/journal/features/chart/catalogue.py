from journal.features.chart.entry import Entry
from journal.models.all_models import AllModels
from journal.models.node_kind import NodeKind
from journal.refused import Refused

AGENT_EVENTS = (
    ("session_started", "Session starts", "Claude or Codex starts or resumes a conversation here"),
    ("prompt_submitted", "Prompt sent", "the user, or a typed line, sends the agent a prompt"),
    ("tool_starting", "Tool about to run", "before a read, a write, a command or a dispatch; the moment a hold or a deny is possible"),
    ("tool_finished", "Tool finished", "after a tool ran, with its result"),
    ("idle", "Agent stops", "the agent finishes responding; the moment a stop can be blocked and the journal speaks"),
    ("turn_written", "Agent wrote to the user", "a turn of the agent's reaches the chat; Claude only"),
    ("subagent_started", "Subagent starts", "the agent dispatched a subagent"),
    ("subagent_ended", "Subagent ends", "a subagent reported back"),
    ("compacting", "Context compacts", "the conversation is about to be summarised"),
    ("session_ended", "Session ends", "the agent's process is gone"),
    ("ticked", "Clock ticks", "every few seconds for each live agent"),
)
CHECKS = (
    ("plain_idle", "Agent idle?", "no current work, nothing awaited, not stuck"),
    ("open_tasks", "Has open tasks?", "the environment has open tasks the agent may take up, outside a plan not yet started"),
    ("task_in_hand", "Has a task in hand?", "the agent has a task started"),
    ("parked_tasks", "Has parked tasks?", "a task is parked"),
    ("blocked_tasks", "Has blocked tasks?", "a task waits on something outside"),
    ("unread_messages", "Has unread messages?", "the user left a message the agent has not read"),
    ("unanswered_messages", "Has unanswered messages?", "a message was read and not yet replied to or given a face"),
    ("auto_mode", "Auto mode on?", "the environment runs in auto mode"),
    ("same_stop_again", "Same stop repeated?", "this stop was already refused once and nothing happened since"),
    ("following_plan", "Following a plan?", "the agent is on a plan's task"),
    ("tool_writes", "Tool changes files?", "the tool about to run changes a file or runs a writing command"),
    ("journal_command", "Tool is a journal command?", "the tool about to run is a journal command"),
    ("running_sequence", "In a sequence?", "the agent is on a step of a sequence"),
)
COUNTER_CHECKS = (
    ("tool_uses_since_unread_every", "Every Nth tool use with a message unread?", "true on every Nth tool use since the oldest unread message came; the text is N"),
    ("tool_uses_since_unread_over", "N tool uses with a message unread?", "at least N tool uses since the oldest unread message came; the text is N or a setting's name"),
    ("tool_uses_since_read_over", "N tool uses with a message unanswered?", "at least N tool uses since the oldest message was read and not answered; the text is N or a setting's name, such as messages.hold_after"),
    ("edits_since_log_over", "N edits since the last log?", "the task in hand has at least N edits since it was logged; the text is N or a setting's name, such as tasks.log_after"),
    ("edits_since_log_every", "Every Nth edit since the last log?", "true on every Nth edit since the task in hand was logged; the text is N or a setting's name"),
)
ACTIONS = (
    ("say", "Send message to agent", "sends the message to the agent once; repeats are skipped for a set time", True),
    ("hold", "Block tool use", "stops the tool and sends the message, until what the message names is done", True),
    ("block_stop", "Block stop", "the agent carries on, with the message", True),
    ("type", "Type into terminal", "types the text into the agent's terminal as its next prompt", True),
    ("start_sequence", "Start sequence", "starts the sequence named in the text at its first step", True),
)


class Catalogue:
    """Everything a node may be: a trigger for each agent event and each row event, the checks the journal can answer, and the actions it can take."""

    def triggers(self) -> list[Entry]:
        agent = [Entry(NodeKind.TRIGGER, key, title, about, providers=("claude",) if key == "turn_written" else ("claude", "codex")) for key, title, about in AGENT_EVENTS]
        rows = [Entry(NodeKind.TRIGGER, f"{model.table()}.{moment}", f"A {model.__name__.lower()} is {moment}", f"a row of {model.table()} is {moment} by anyone")
                for model in AllModels.MODELS for moment in ("created", "updated", "deleted")]
        return agent + rows

    def checks(self) -> list[Entry]:
        plain = [Entry(NodeKind.CHECK, key, title, about) for key, title, about in CHECKS]
        counters = [Entry(NodeKind.CHECK, key, title, about, takes_text=True) for key, title, about in COUNTER_CHECKS]
        return plain + counters

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
