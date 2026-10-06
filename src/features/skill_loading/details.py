from features.base import Behaviour, FeatureDetails, Line
from features.settings import Setting
from features.trigger import Trigger, USES
from features.groups import Group


class SkillLoadingDetails(FeatureDetails):
    explains = 'The journal reminds the agent to load the guidance it needs after a fresh start. You can see which skills it loaded.'
    name = "skill_loading"
    group = Group.SKILLS
    trigger_label = "Remind the agent to load the journal skill"
    has_skill = False

    title = "Skill loading"

    aliases = ("skills",)


    abstract = "Tells the agent to load the journal skill when it has not, once each time its context starts fresh."

    help = """
        A session start or compaction opens a fresh window; triggers.skills sets how long the
        feature waits before its one reminder.
    """

    trigger = Trigger(every=25, unit=USES)

    behaviours = [
        Behaviour(
            name="reload",
            title="After the context is summarized, block file changes until the journal skill is loaded",
        ),
        Behaviour(
            name="chat",
            title="Show each loaded skill in the chat",
        ),
        Behaviour(
            name="always",
            title="At a session start, block tool calls until the session-start skills are loaded",
        ),
        Behaviour(
            name="keywords",
            title="Load a skill when one of its words comes up",
        ),
        Behaviour(
            name="stale",
            title="When a session-start skill changes, block tool calls until it is reloaded",
        ),
    ]

    settings = [
        Setting(
            name="most_refusals",
            default=5,
            title="Block tool calls at most",
            abstract="After that, tool calls go through for a while",
            unit="times",
        ),
        Setting(
            name="steps_aside",
            default=10,
            title="Then let tool calls through for",
            unit="tool calls",
        ),
        Setting(
            name="recent",
            default=5,
            title="After the context is summarized, also reload this many recently used skills",
            unit="skills",
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
