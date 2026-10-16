from journal.features.chart.entry import Entry
from journal.models.all_models import AllModels
from journal.models.node_kind import NodeKind
from journal.refused import Refused

AGENT_EVENTS = (
    ("session_started", "Session starts", "Claude or Codex starts or resumes a conversation here"),
    ("prompt_submitted", "Prompt sent", "you, or a typed line, send the agent a prompt"),
    ("tool_starting", "Tool about to run", "before a read, a write, a command or a dispatch; the moment a hold or a deny is possible"),
    ("tool_finished", "Tool finished", "after a tool ran, with its result"),
    ("idle", "Agent stops", "the agent finishes responding; the moment a stop can be blocked and the journal speaks"),
    ("turn_written", "Agent writes to you", "a turn of the agent's reaches the chat; Claude only"),
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
    ("log_stale_over", "Is the log older than N seconds?", "the task in hand was last logged longer ago than N seconds, or never; the text is N"),
    ("unread_reminders_over", "N namings of the unread inbox gone by?", "the tool uses since the oldest unread message came, counted in units of the setting messages.remind_every, reach N; the text is N or a setting's name, such as messages.hold_after_reminders"),
    ("unanswered_messages", "Has unanswered messages?", "a message was read and not yet replied to or given a face"),
    ("message_by_user", "Message written by you?", "the row is a message the user wrote, not the agent"),
    ("tool_reads_their_files", "Tool reads the message's own files?", "the tool about to run reads a file attached to a message read and left unanswered"),
    ("own_tool", "The agent's own tool use?", "the tool use is the agent's own, not a subagent's"),
    ("auto_mode", "Auto mode on?", "the environment runs in auto mode"),
    ("plan_at_checkpoint", "Plan at a checkpoint?", "a started plan stands at a completed checkpoint phase, its next phase not begun"),
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
    ("quiet_for_over", "Has the agent been quiet for N seconds?", "the clock ticks and the agent has done nothing for at least N seconds; the text is N or a setting's name"),
    ("edits_since_log_at", "Exactly N edits since the last log?", "true once, when the edits since the task in hand was logged, before this one, are exactly N; the text is N or a setting's name, such as tasks.first_nudge_after"),
)
COUNT_CHECKS = (
    ("count_over", "Is a count over N?", "the agent's count named first in the text has reached N; the text is the count's name, then N or a setting's name, such as reads messages.hold_after"),
    ("count_at", "Is a count at N?", "the agent's count named first in the text stands at exactly N; the text is the count's name, then N or a setting's name"),
)
ACTIONS = (
    ("say", "Send the agent a message", "sends the message to the agent once; repeats are skipped for a set time; a message opening with a nudge's key in brackets, [messages.new], speaks as that nudge, with its repeat window and record", True),
    ("hold", "Hold the tool", "stops the tool and sends the message, until what the message names is done", True),
    ("block_stop", "Keep the agent from stopping", "the agent carries on, with the message", True),
    ("type", "Type to the agent", "types the text into the agent's terminal as its next prompt; a text opening with a nudge's key in brackets speaks as that nudge first", True),
    ("start_sequence", "Start sequence", "starts the sequence named in the text at its first step", True),
    ("count_start", "Start a count", "sets the agent's count named in the text to nought; a check at a later event reads it", True),
    ("count_one", "Count one", "adds one to the agent's count named in the text", True),
    ("stop_here", "Stop here", "ends the walk of the event: nothing follows it in this workflow, and no later workflow of the trigger runs", False),
    ("show_card", "Show a card in the chat", "a card in the chat with the message, so the user sees what the journal did", True),
    ("move_to", "Change the agent's state", "moves the agent through the engine's machine: to idle from a state that owns nothing, or into expecting or stuck over what it is doing, with the words after the state's name as what it waits for; a state that owns a row is entered by what makes that row", True),
    ("release", "End the agent's wait", "an agent paused for a worker, a question or anything outside goes back to what it was doing, told with the message; an agent not paused is left as it is", True),
)


def article(words: str) -> str:
    """A or An before the words, by their first sound: an edit, an MCP server, a task."""
    first = words.split(" ")[0]
    return "An" if first[0].lower() in "aeiou" or (first.isupper() and first[0] in "AEFHILMNORSX") else "A"


OWN = ("agents", "entries", "links")
"""The engine's own tables, which a walk writes itself when it moves an agent, records itself or draws a line: a trigger on them would walk without end, so no workflow may name them."""


class Catalogue:
    """Everything a node may be: a trigger for each agent event and each row event, the checks the journal can answer, and the actions it can take."""

    def triggers(self) -> list[Entry]:
        agent = [Entry(NodeKind.TRIGGER, key, title, about, providers=("claude",) if key == "turn_written" else ("claude", "codex")) for key, title, about in AGENT_EVENTS]
        rows = [Entry(NodeKind.TRIGGER, f"{model.table()}.{moment}", f"{article(model.noun())} {model.noun()} is {moment}", f"a row of {model.table()} is {moment} by anyone", group=model.noun())
                for model in AllModels.MODELS if model.table() not in OWN for moment in ("created", "updated", "deleted")]
        return agent + rows

    def checks(self) -> list[Entry]:
        plain = [Entry(NodeKind.CHECK, key, title, about) for key, title, about in CHECKS]
        counters = [Entry(NodeKind.CHECK, key, title, about, takes_text=True) for key, title, about in COUNTER_CHECKS + COUNT_CHECKS]
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
