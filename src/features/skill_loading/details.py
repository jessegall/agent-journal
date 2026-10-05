from features.base import Behaviour, FeatureDetails, Line
from features.settings import Setting
from features.trigger import Trigger, USES
from features.groups import Group


class SkillLoadingDetails(FeatureDetails):
    name = "skill_loading"
    group = Group.SKILLS
    trigger_label = "Remind the agent to load the journal skill"
    has_skill = False

    title = "Skill loading"

    aliases = ("skills",)


    abstract = "An agent working on with no journal skill is told once per context window to load one"

    help = """
        A session start or compaction opens a fresh window; triggers.skills sets how long the
        feature waits before its one reminder.
    """

    trigger = Trigger(every=25, unit=USES)

    behaviours = [
        Behaviour(
            name="reload",
            title="Pause writes after a compaction until the skill is loaded",
        ),
        Behaviour(
            name="chat",
            title="Show each loaded skill in the chat",
        ),
        Behaviour(
            name="always",
            title="Pause tool calls until every-start skills are loaded",
        ),
        Behaviour(
            name="keywords",
            title="Load a skill when its keyword comes up",
        ),
        Behaviour(
            name="stale",
            title="Reload every-start skills that changed",
        ),
    ]

    settings = [
        Setting(
            name="most_refusals",
            default=5,
            title="Refuse tool calls at most",
            abstract="Then they go through for a while",
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
            title="After a compaction, also reload the last used",
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
