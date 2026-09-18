from features import trigger
from features.base import Feature, on


class Skills(Feature):
    name = "skills"
    title_ = "The journal skill loaded"
    abstract_ = "An agent working on with no journal skill in its window is told once, every so many tool uses, to load one"
    help_ = "A compaction empties the window; the skills in it are read from the transcript. triggers.skills sets the cadence (every 25 uses)."
    trigger = {"every": 25, "unit": trigger.USES}

    @on("agent.updated")
    def check(self, event, record) -> None:
        agent = self.agent_due(event, record)
        if not agent:
            return
        loaded = agent.skills
        if any(s == "journal" or s.startswith("journal-") for s in loaded):
            return
        self.nudge(record, agent, "no journal skill is loaded in this window", "load the journal skill (Skill: journal) before the next write; a compaction emptied it", private=True)
