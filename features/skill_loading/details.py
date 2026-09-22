from features.base import Behaviour, FeatureDetails, Line
from features.settings import Setting
from features.trigger import Trigger, USES


class SkillsDetails(FeatureDetails):
    name = "skill_loading"

    title = "Skill loading"

    aliases = ("skills",)

    speaks_while_waiting = True

    abstract = "An agent working on with no journal skill is told once per context window to load one"

    help = """
        A session start or compaction opens a fresh window; triggers.skills sets how long the
        feature waits before its one reminder.
    """

    trigger = Trigger(every=25, unit=USES)

    behaviours = [
        Behaviour(
            name="reload",
            title="Hold writes after a compaction until the journal skill is loaded again",
            abstract="A fresh window starts without the skill; the first write waits for Skill: journal",
        ),
        Behaviour(
            name="chat",
            title="Show each skill the agent loads as a line in the chat",
            abstract="Loaded skill and its name, in faint green, where it happened in the conversation",
        ),
        Behaviour(
            name="always",
            title="Hold tool calls at a session start until every always-on skill is loaded",
            abstract="The skills switched to every start on the Skills page, again after a compaction",
        ),
        Behaviour(
            name="keywords",
            title="Load a skill when one of its keywords comes up",
            abstract="A skill's keywords, from its frontmatter or the Skills page, in what the user writes or the agent runs",
        ),
        Behaviour(
            name="stale",
            title="Hold tool calls when an every-start skill changed since it was loaded",
            abstract="The every-start skills are loaded again before the next call; the rest are only named once",
        ),
    ]

    settings = [
        Setting(
            name="most_refusals",
            default=5,
            title="Refuse tool calls for a missing skill at most",
            abstract="After this many refusals in a row the call goes through, so an agent is never stuck",
            unit="times",
        ),
    ]

    lines = [
        Line(
            name="unloaded",
            title="no journal skill is loaded in this window",
            brief="load the journal skill (Skill: journal) before the next write; a compaction emptied it",
        ),
        Line(
            name="stale",
            title="{{skills}} changed since you loaded them",
            brief="load one again when you next need it; only the every-start skills are held for",
            while_waiting=False,
        ),
        Line(
            name="required",
            title="load {{skills}} before anything else",
            brief="every tool call waits until it is loaded: {{loads}}",
        ),
    ]
