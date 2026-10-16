from journal.features.chart.commands.chart_command import ChartCommand
from journal.features.chart.listeners.forget_counts_at_end import ForgetCountsAtEnd
from journal.features.chart.listeners.walk_agent_events import WalkAgentEvents
from journal.features.chart.listeners.walk_row_events import WalkRowEvents
from journal.features.chart.seeds.shipped_chart import ShippedChart
from journal.features.entry import Entry
from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.models.node_kind import NodeKind
from journal.features.skill import Skill


class ChartFeature(Feature):
    name = "chart"
    title = "Workflows"
    help = "The journal's conduct toward the agent as a flowchart the user edits: triggers, checks and actions joined by lines."
    commands = (ChartCommand,)
    seeds = (ShippedChart,)
    listeners = (WalkAgentEvents, WalkRowEvents, ForgetCountsAtEnd)
    checks = (
        Entry(NodeKind.CHECK, 'something_owed', 'Owes a skill, a look or a mark?', 'the agent owes the journal something before it may stop: a skill to read, the look at what is in flight, or a decision at a context mark'),
        Entry(NodeKind.CHECK, 'own_tool', 'Tool used by the agent itself, not a subagent?', "the tool use is the agent's own, not a subagent's"),
        Entry(NodeKind.CHECK, 'auto_mode', 'Auto mode on?', 'the environment runs in auto mode'),
        Entry(NodeKind.CHECK, 'tool_writes', 'Tool changes files?', 'the tool about to run changes a file or runs a writing command'),
        Entry(NodeKind.CHECK, 'quiet_for_over', 'Has the agent been quiet for N seconds?', "the clock ticks and the agent has done nothing for at least N seconds; the text is N or a setting's name", takes_text=True),
        Entry(NodeKind.CHECK, 'count_over', 'Is a count over N?', "the agent's count named first in the text has reached N; the text is the count's name, then N or a setting's name, such as reads messages.hold_after", takes_text=True),
        Entry(NodeKind.CHECK, 'count_at', 'Is a count at N?', "the agent's count named first in the text stands at exactly N; the text is the count's name, then N or a setting's name", takes_text=True),
        Entry(NodeKind.CHECK, 'count_every', 'Is a count at every Nth?', "the agent's count named first in the text is a multiple of N, not zero; the text is the count's name, then N or a setting's name, such as uses messages.remind_every", takes_text=True),
    )
    actions = (
        Entry(NodeKind.ACTION, 'say', 'Send the agent a message', "sends the message to the agent once; repeats are skipped for a set time; a message opening with a nudge's key in brackets, [messages.new], speaks as that nudge, with its repeat window and record", takes_text=True),
        Entry(NodeKind.ACTION, 'hold', 'Hold the tool', 'stops the tool and sends the message, until what the message names is done', takes_text=True),
        Entry(NodeKind.ACTION, 'block_stop', 'Keep the agent from stopping', 'the agent carries on, with the message', takes_text=True),
        Entry(NodeKind.ACTION, 'type', 'Type to the agent', "types the text into the agent's terminal as its next prompt; a text opening with a nudge's key in brackets speaks as that nudge first", takes_text=True),
        Entry(NodeKind.ACTION, 'count_start', 'Start a count', "sets the agent's count named in the text to zero; a check at a later event reads it", takes_text=True),
        Entry(NodeKind.ACTION, 'count_one', 'Count one', "adds one to the agent's count named in the text", takes_text=True),
        Entry(NodeKind.ACTION, 'stop_here', 'Stop here', 'ends the walk of the event: nothing follows it in this workflow, and no later workflow of the trigger runs'),
        Entry(NodeKind.ACTION, 'show_card', 'Show a card in the chat', 'a card in the chat with the message, so the user sees what the journal did', takes_text=True),
        Entry(NodeKind.ACTION, 'wait_outside', 'Wait for something outside', 'the agent waits for what the text names, it stays in effect until the agent uses a tool itself, you send it a word, or Send the agent back runs; one wait at a time', takes_text=True),
        Entry(NodeKind.ACTION, 'mark_stuck', 'Mark the agent stuck', "the agent is stuck for the reason in the text, and the journal says nothing until the agent's next tool use; one wait at a time", takes_text=True),
        Entry(NodeKind.ACTION, 'go_idle', 'Change state to Idle', 'the agent is idle, from a state that owns nothing: a task in hand or a wait with its way back is not dropped'),
        Entry(NodeKind.ACTION, 'release', 'Send the agent back to what it was doing', 'an agent paused, on a worker, a question, something outside, being stuck or a sequence, goes back to the state the pause keeps, told with the message; an agent not paused is left as it is', takes_text=True),
    )

    LINE = Nudge(name, "line", "{{text}}", repeat_after=0)
    """A chart line is said whenever its path is walked: when it repeats is the chart's own business, through its checks."""
    AWAITING = Nudge(name, "awaiting", "you stopped while the journal awaits {{awaiting}}", "do that first, or journal stuck \"<why>\" if you are truly stuck", repeat_after=0)
    """A stop while the agent owes the journal something: the Always workflow at a stop says what it awaits."""
    nudges = (LINE, AWAITING)

    skill = Skill("chart", "The workflows of the journal's conduct; load it when a workflow is read or edited", """
# The workflows

The journal's conduct toward the agent is workflows: each answers one event, bound to a state or to none, and an
event's workflows run in the order the user sets, the locked guards first, then the Always ones, then the states'.
A trigger is an event, a check a yes or no question, an action what the journal does; lines join them, then from a
trigger or an action, yes or no from a check, one line per port. A locked workflow or step ships with the journal and cannot be removed:
not deleted, not turned off, not reworded or gated; a Stop here node ends the event's walk for everything after
it; the first hold of an event wins and one move per event is taken. A count the workflow keeps for the agent is
started, counted one and read by its name on the canvas.

- `journal chart show` prints every workflow in its event's order; `journal chart catalogue` lists everything a node may be.
- `journal chart new "<title>" --on <event> [--for <state>]` makes one, at the end of its event's list; `journal chart order <event> <n>...` sets the order.
- `journal chart node <trigger|check|action> <key> [--text "<line>"] --in <n>`, `journal chart line <from> <to> [--port yes|no]`,
  `journal chart remove <n>` edit one by hand, a default workflow only with `--edit-default`, since an edit changes how
  the journal drives the agent; the Workflows page edits it as a drawing. `journal chart reset <n>` brings a shipped
  drawing back, every edit gone; `journal chart try <event>` walks it dry and says what it would do.
""", keywords=('chart', 'flowchart', 'trigger', 'conduct'))
