from features.base import Behaviour, FeatureDetails, Line
from features.trigger import USES


class SkillsDetails(FeatureDetails):
    name = "skills"

    title = "Skills"

    abstract = "An agent working on with no journal skill is told once per context window to load one"

    help = """
        A session start or compaction opens a fresh window; triggers.skills sets how long the
        feature waits before its one reminder.
    """

    trigger = {"every": 25, "unit": USES}

    behaviours = [
        Behaviour(
            name="reload",
            title="Hold writes after a compaction until the journal skill is loaded again",
            abstract="A fresh window starts without the skill; the first write waits for Skill: journal",
        ),
        Behaviour(
            name="stale",
            title="Name a skill that changed since it was loaded",
            abstract="Said every tenth tool use until the agent loads it again",
            trigger={"every": 10, "unit": USES},
        ),
    ]

    lines = [
        Line(
            name="unloaded",
            title="no journal skill is loaded in this window",
            brief="load the journal skill (Skill: journal) before the next write; a compaction emptied it",
        ),
        Line(
            name="reload held",
            title="a fresh window has no journal skill: load it first - Skill: journal",
        ),
        Line(
            name="stale",
            title="{{count}} changed since you loaded {{them}}",
            brief="load again: {{skills}}",
        ),
        Line(
            name="needed",
            title="load the {{skill}} skill",
            brief="Skill: {{skill}} explains journal {{noun}}, which you just ran",
        ),
    ]
