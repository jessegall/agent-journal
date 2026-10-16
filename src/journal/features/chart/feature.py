from journal.features.chart.commands.chart_command import ChartCommand
from journal.features.chart.listeners.forget_counts_at_end import ForgetCountsAtEnd
from journal.features.chart.listeners.walk_agent_events import WalkAgentEvents
from journal.features.chart.listeners.walk_row_events import WalkRowEvents
from journal.features.chart.seeds.shipped_chart import ShippedChart
from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.skill import Skill


class ChartFeature(Feature):
    name = "chart"
    title = "Workflows"
    help = "The journal's conduct toward the agent as a flowchart the user edits: triggers, checks and actions joined by lines."
    commands = (ChartCommand,)
    seeds = (ShippedChart,)
    listeners = (WalkAgentEvents, WalkRowEvents, ForgetCountsAtEnd)

    LINE = Nudge(name, "line", "{{text}}", repeat_after=0)
    """A chart line is said whenever its path is walked: when it repeats is the chart's own business, through its checks."""
    nudges = (LINE,)

    skill = Skill("chart", "The workflows of the journal's conduct; load it when a workflow is read or edited", """
# The workflows

The journal's conduct toward the agent is workflows: each answers one event, bound to a state or to none, and an
event's workflows run in the order the user sets, the locked guards first, then the Always ones, then the states'.
A trigger is an event, a check a yes or no question, an action what the journal does; lines join them, then from a
trigger or an action, yes or no from a check, one line per port. A locked workflow or step is the journal's law:
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
