from journal.features.chart.commands.chart_command import ChartCommand
from journal.features.chart.listeners.walk_agent_events import WalkAgentEvents
from journal.features.chart.listeners.walk_row_events import WalkRowEvents
from journal.features.chart.seeds.shipped_chart import ShippedChart
from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.skill import Skill


class ChartFeature(Feature):
    name = "chart"
    title = "Chart"
    help = "The journal's conduct toward the agent as a flowchart the user edits: triggers, checks and actions joined by lines."
    commands = (ChartCommand,)
    seeds = (ShippedChart,)
    listeners = (WalkAgentEvents, WalkRowEvents)

    LINE = Nudge(name, "line", "{{text}}", repeat_after=0)
    """A chart line is said whenever its path is walked: when it repeats is the chart's own business, through its checks."""
    nudges = (LINE,)

    skill = Skill("chart", "The chart of the journal's conduct; load it when the chart is read or edited", """
# The chart

One chart per journal: a flowchart of the journal's conduct toward the agent. A trigger is an event, a check a
yes or no question, an action what the journal does; lines join them, then from a trigger or an action, yes or
no from a check.

- `journal chart show` prints it; `journal chart catalogue` lists everything a node may be.
- `journal chart node <trigger|check|action> <key> [--text "<line>"]`, `journal chart line <from> <to> [--port yes|no]`,
  `journal chart remove <n>` edit it by hand; the chart page edits it as a drawing. `journal chart reset` brings the
  shipped chart back, every edit gone.
""", keywords=('chart', 'flowchart', 'trigger', 'conduct'))
