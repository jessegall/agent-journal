from features import trigger
from features.base import Feature, event
from resources.types import AgentRow


class Skills(Feature):
    name = "skills"
    title_ = "The journal skill loaded"
    abstract_ = "An agent working on with no journal skill is told once per context window to load one"
    help_ = "A session start or compaction opens a fresh window; triggers.skills sets how long the feature waits before its one reminder."
    trigger = {"every": 25, "unit": trigger.USES}
    windows = ("SessionStart", "PreCompact")

    @event("agent.updated")
    def check(self, event, record) -> None:
        agent = self.agent(event, record)
        state = trigger.last(record, agent.title, self.name)
        if agent.event in self.windows and state.get(AgentRow.event) != agent.event:
            trigger.write(record, agent, self.name, told=False, uses=agent.uses or 0, context=agent.context or 0)
            state = trigger.last(record, agent.title, self.name)
        if "told" not in state and state.get(AgentRow.at):
            trigger.write(record, agent, self.name, told=True)
            state = trigger.last(record, agent.title, self.name)
        if state.get("told") or not self.due(record, agent):
            return
        loaded = agent.skills
        if any(s == "journal" or s.startswith("journal-") for s in loaded):
            return
        self.nudge(record, agent, "no journal skill is loaded in this window", "load the journal skill (Skill: journal) before the next write; a compaction emptied it", private=True)
        trigger.write(record, agent, self.name, told=True)
