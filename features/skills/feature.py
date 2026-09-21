import re
import time
from pathlib import Path

from skills import LIBRARY

from features import trigger
from features.trigger import USES
from controllers.types import Agents
from features.base import Behaviour, Feature, event, interceptor, Line
from features.skills.catalogue import SKILL, loaded_at, skills
from providers import PROVIDERS
from resources.base import Refused, SYSTEM
from resources.types import AgentRow

NOUN = re.compile(r"(?:^|[\s;&|(])journal(?:\s+--\S+)*\s+([a-z]+)\b")


class Skills(Feature):
    name = "skills"
    lines = {"unloaded": Line("no journal skill is loaded in this window", "load the journal skill (Skill: journal) before the next write; a compaction emptied it"),
             "reload held": Line("a fresh window has no journal skill: load it first - Skill: journal"),
             "stale": Line("{{count}} changed since you loaded {{them}}", "load again: {{skills}}"),
             "needed": Line("load the {{skill}} skill", "Skill: {{skill}} explains journal {{noun}}, which you just ran")}
    title_ = "Skills"
    abstract_ = "An agent working on with no journal skill is told once per context window to load one"
    help_ = "A session start or compaction opens a fresh window; triggers.skills sets how long the feature waits before its one reminder."
    trigger = {"every": 25, "unit": trigger.USES}
    windows = ("SessionStart", "PreCompact")
    behaviours = {"reload": Behaviour("Hold writes after a compaction until the journal skill is loaded again",
                                      "A fresh window starts without the skill; the first write waits for Skill: journal"),
                  "stale": Behaviour("Name a skill that changed since it was loaded", "Said every tenth tool use until the agent loads it again",
                                     trigger={"every": 10, "unit": USES})}

    @event("agent.updated")
    def check(self, event, record) -> None:
        agent = self.agent(event, record)
        state = trigger.last(record, agent.title, self.name)
        if agent.event in self.windows and state.get(AgentRow.event) != agent.event:
            trigger.write(record, agent, self.name, told=False, uses=agent.uses or 0, context=agent.context or 0, since=time.time())
            state = trigger.last(record, agent.title, self.name)
        if "told" not in state and state.get(AgentRow.at):
            trigger.write(record, agent, self.name, told=True)
            state = trigger.last(record, agent.title, self.name)
        if state.get("told") or not self.due(record, agent):
            return
        loaded = agent.skills
        if any(s == "journal" or s.startswith("journal-") for s in loaded):
            return
        self.journal.whisper(record, agent, "unloaded")
        trigger.write(record, agent, self.name, told=True)

    @event("agent.updated")
    def reload(self, event, record) -> None:
        if not self.on(record, "reload"):
            return
        agent = self.agent(event, record)
        since = float(trigger.last(record, agent.title, self.name).get("since") or 0)
        provider = PROVIDERS.get(agent.provider)
        if not since or not provider or not agent.transcript:
            return
        loaded = provider().loaded_skills(Path(agent.transcript))
        if any(name == "journal" and float(at or 0) >= since for name, at in loaded.items()):
            self.release(record, "reload", agent)
        else:
            self.hold(record, "reload held", "reload", agent)

    @event("agent.updated")
    def stale(self, event, record) -> None:
        agent = self.agent(event, record)
        if not self.due(record, agent, "stale"):
            return
        changed = [s[SKILL.name] for s in skills(record, agent.n) if s[SKILL.stale]]
        if changed:
            self.journal.whisper(record, agent, "stale", count=self.plural(len(changed), "skill"), them="it" if len(changed) == 1 else "them",
                     skills=", ".join(f"Skill: {name}" for name in changed))

    @interceptor
    def needed(self, provider, record, hook, session) -> str:
        found = NOUN.search(hook.tool.command) if hook.tool.command else None
        library = record.root.parent / LIBRARY
        skill = next((f"journal-{name}" for name in (found.group(1), f"{found.group(1)}s") if (library / f"journal-{name}" / "SKILL.md").is_file()), "") if found else ""
        if not skill:
            return ""
        try:
            agent = Agents(record, actor=SYSTEM).by_session(session)
        except Refused:
            return ""
        since = float(trigger.last(record, agent.title, self.name).get("since") or 0)
        at = float(loaded_at(agent).get(skill) or 0)
        if not (at and at >= since) and not self.already(record, agent.title, "needed", f"{since}:{skill}"):
            self.journal.whisper(record, agent, "needed", skill=skill, noun=found.group(1))
        return ""
