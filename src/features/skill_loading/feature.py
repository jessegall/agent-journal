from controllers.types import Agents
from engine.events.agents import AgentReported, SessionStarted, ToolFinished
from engine.events.resources import MessageCreated
from expects import Answered, Given, Kept, Refused, Unchanged, Updated, Wrote
from features.base import Feature
from providers.payload import BashCall
from resources.types import AgentRow, Message
from features.journal import Journal
from features.skill_loading.details import SkillLoadingDetails
from features.skill_loading.handlers import HoldUntilReloaded, NameStaleSkills, RemindUnloaded, RequireAlwaysSkills, RequireSkillsTheUserNames, ShowLoadsInChat
from features.skill_loading.interceptors import RefuseUntilLoaded, RequireCommandSkill
from features.skill_loading.catalogue import handed
from features.session_briefing.start import SKILLS, START_PARTS
from features.skill_loading.commands import LoadSkill, SetKeywords, ShowSkill, ShowSkills
from features.skill_loading.routes import get_skill, get_skills, post_skill_always, post_skill_keywords, post_skill_load


class SkillLoading(Feature):
    details = SkillLoadingDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_skills, get_skill, post_skill_load, post_skill_always, post_skill_keywords)
        journal.commands.add("agent", ShowSkills(), expects=[Given((Agents,)) >> Answered([])])
        journal.commands.add("agent", ShowSkill(), expects=[Given((Agents, "journal")) >> Refused("no skill journal")])
        journal.commands.add("agent", LoadSkill(), expects=[
            Given((Agents, "journal"), rows=[AgentRow(n=1, title="claude-1")]) >> Answered({"notice": "the agent is asked, and its tool calls wait until the skill is loaded"})
                & Wrote(Message(title="Please load the journal skill now")),
        ])
        journal.commands.add("agent", SetKeywords(), expects=[
            Given((Agents, "journal", [" notes ", "plans", " "])) >> Answered({"keywords": ["notes", "plans"]}),
        ])
        START_PARTS.add(self, handed, key=SKILLS)
        journal.events.handler(RemindUnloaded(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"event": "PostToolUse", "skills": ["journal"]})]) >> Unchanged(),
        ])
        journal.events.handler(HoldUntilReloaded(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"provider": "claude"})]) >> Unchanged(),
        ])
        journal.events.handler(NameStaleSkills(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
        ])
        journal.events.handler(RequireAlwaysSkills(), expects=[
            Given(SessionStarted(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
        ])
        journal.events.handler(ShowLoadsInChat(), expects=[
            Given(ToolFinished(agent=1, tool="Skill", skill="journal"), rows=[AgentRow(n=1, title="claude-1")]) >> Updated(AgentRow(n=1), skill_loads=[{"skill": "journal"}]),
            Given(ToolFinished(agent=1, tool="Bash"), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
        ])
        journal.events.handler(RequireSkillsTheUserNames(), expects=[
            Given(MessageCreated(n=3, type="message", actor="user"), rows=[AgentRow(n=1, title="claude-1"), Message(n=3, title="plan it", seen=["user"])]) >> Unchanged(),
        ])
        journal.agent.interceptor(RequireCommandSkill(), expects=[
            Given(BashCall.from_payload("Bash", {"command": "ls"}, {}), rows=[AgentRow(n=1, title="claude-1")]) >> Kept(),
        ])
        journal.agent.interceptor(RefuseUntilLoaded(), expects=[
            Given(BashCall.from_payload("Bash", {"command": "ls"}, {}), rows=[AgentRow(n=1, title="claude-1")]) >> Kept(),
        ])
