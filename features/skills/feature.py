from features import trigger
from features.trigger import USES
from features.base import Behaviour, Feature, event
from features.skills.catalogue import SKILL, skills
from resources.types import AgentRow


class Skills(Feature):
    name = "skills"
    title_ = "Skills"
    abstract_ = "An agent working on with no journal skill is told once per context window to load one"
    help_ = "A session start or compaction opens a fresh window; triggers.skills sets how long the feature waits before its one reminder."
    trigger = {"every": 25, "unit": trigger.USES}
    windows = ("SessionStart", "PreCompact")
    behaviours = {"stale": Behaviour("Name a skill that changed since it was loaded", "Said every twentieth tool use until the agent loads it again",
                                     trigger={"every": 20, "unit": USES})}

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

    @event("agent.updated")
    def stale(self, event, record) -> None:
        agent = self.agent(event, record)
        if not self.due(record, agent, "stale"):
            return
        changed = [s[SKILL.name] for s in skills(record, agent.n) if s[SKILL.stale]]
        if changed:
            self.nudge(record, agent, f"{self.plural(len(changed), 'skill')} changed since you loaded {'it' if len(changed) == 1 else 'them'}",
                       f"load again: {', '.join(f'Skill: {name}' for name in changed)}", private=True)
