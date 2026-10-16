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
    ("open_tasks", "Has open tasks?", "the environment has open tasks the agent may take up, outside a plan not yet started"),
    ("task_in_hand", "Has a task in hand?", "the agent has a task started"),
    ("parked_tasks", "Has parked tasks?", "a task is parked"),
    ("blocked_tasks", "Has blocked tasks?", "a task waits on something outside"),
    ("unread_messages", "Has unread messages?", "the user left a message the agent has not read"),
    ("unread_over", "N or more messages unread?", "at least N messages the agent has not read; the text is N"),
    ("log_stale_over", "Log older than N seconds?", "the task in hand was last logged longer ago than N seconds, or never; the text is N"),
    ("unread_reminders_over", "N namings of the unread inbox gone by?", "the tool uses since the oldest unread message came, counted in units of the setting messages.remind_every, reach N; the text is N or a setting's name, such as messages.hold_after_reminders"),
    ("unanswered_messages", "Has unanswered messages?", "a message was read and not yet replied to or given a face"),
    ("message_by_user", "Message written by the user?", "the row is a message the user wrote, not the agent"),
    ("tool_reads_their_files", "Tool reads the message's own files?", "the tool about to run reads a file attached to a message read and left unanswered"),
    ("auto_mode", "Auto mode on?", "the environment runs in auto mode"),
    ("tool_writes", "Tool changes files?", "the tool about to run changes a file or runs a writing command"),
    ("journal_command", "Tool is a journal command?", "the tool about to run is a journal command"),
    ("worker_reported", "Worker reported?", "the row is a worker that just reported"),
    ("worker_stopped", "Worker stopped?", "the row is a worker that just stopped before reporting"),
    ("agent_awaits_the_worker", "Agent awaits this worker?", "the agent waits on the worker of this row"),
    ("last_worker_back", "Last worker back?", "every worker the agent waits on has reported or stopped"),
    ("question_answered", "Question answered?", "the row is a question the user just answered"),
    ("agent_waits_on_the_question", "Agent waits on this question?", "the agent waits on the question of this row"),
)
COUNTER_CHECKS = (
    ("tool_uses_since_unread_every", "Every Nth tool use with a message unread?", "true on every Nth tool use since the oldest unread message came; the text is N"),
    ("tool_uses_since_unread_over", "N tool uses with a message unread?", "at least N tool uses since the oldest unread message came; the text is N or a setting's name"),
    ("tool_uses_since_read_over", "N tool uses with a message unanswered?", "at least N tool uses since the oldest message was read and not answered; the text is N or a setting's name, such as messages.hold_after"),
    ("edits_since_log_over", "N edits since the last log?", "the task in hand had at least N edits since it was logged, before this one; the text is N or a setting's name, such as tasks.log_after"),
    ("edits_since_log_every", "Every Nth edit since the last log?", "true when the edits since the task in hand was logged, before this one, are a multiple of N; the text is N or a setting's name"),
    ("quiet_for_over", "Quiet for N seconds?", "the clock ticks and the agent has done nothing for at least N seconds; the text is N or a setting's name"),
    ("edits_since_log_at", "Exactly N edits since the last log?", "true once, when the edits since the task in hand was logged, before this one, are exactly N; the text is N or a setting's name, such as tasks.first_nudge_after"),
)
ACTIONS = (
    ("say", "Send message to agent", "sends the message to the agent once; repeats are skipped for a set time; a message opening with a nudge's key in brackets, [messages.new], speaks as that nudge, with its repeat window and record", True),
    ("hold", "Block tool use", "stops the tool and sends the message, until what the message names is done", True),
    ("block_stop", "Block stop", "the agent carries on, with the message", True),
    ("type", "Type into terminal", "types the text into the agent's terminal as its next prompt; a text opening with a nudge's key in brackets speaks as that nudge first", True),
    ("start_sequence", "Start sequence", "starts the sequence named in the text at its first step", True),
    ("show_card", "Show a card in the chat", "a card in the chat with the message, so the user sees what the journal did", True),
    ("move_to", "Move the agent to a state", "moves the agent to the state named in the text through the engine's machine; only idle, which needs nothing, and only from a state that owns nothing: an agent with a task in hand, waiting on something or owing the journal a step stays, and the walk records why", True),
    ("release", "Release the agent from its wait", "an agent paused for a worker, a question or anything outside goes back to what it was doing, told with the message; an agent not paused is left as it is", True),
)


OWN = ("agents", "entries", "links")
"""The engine's own tables, which a walk writes itself when it moves an agent, records itself or draws a line: a trigger on them would walk without end, so no workflow may name them."""


class Catalogue:
    """Everything a node may be: a trigger for each agent event and each row event, the checks the journal can answer, and the actions it can take."""

    def triggers(self) -> list[Entry]:
        agent = [Entry(NodeKind.TRIGGER, key, title, about, providers=("claude",) if key == "turn_written" else ("claude", "codex")) for key, title, about in AGENT_EVENTS]
        rows = [Entry(NodeKind.TRIGGER, f"{model.table()}.{moment}", f"A {model.__name__.lower()} is {moment}", f"a row of {model.table()} is {moment} by anyone")
                for model in AllModels.MODELS if model.table() not in OWN for moment in ("created", "updated", "deleted")]
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
