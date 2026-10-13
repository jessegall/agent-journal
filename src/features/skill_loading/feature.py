import json
from dataclasses import asdict

from controllers.types import Agents
from declaring.trigger import Mark
from events.agents import AgentReported, SessionStarted, ToolCallAnswered, ToolFinished
from events.answers import Allowed
from events.asking import ToolCallAsked
from events.messages import MessageCreated
from events.skill_loading import JournalSkillMissing, RefusalCounted, SessionOwesSkills, SkillLoaded, SkillsOwed, StaleSkillsNamed, WindowOpened, WindowUpgraded
from expects import WHEN, Answered, Dispatches, Given, Nudged, Refused, Remembered, Updated, Wrote, answering, nothing
from events.answers import Refused as RefusedCall
from framework.base import Feature
from resources.types import AgentRow, Message
from framework.journal import Journal
from features.skill_loading.details import SkillLoadingDetails
from features.skill_loading.answering import RefuseUntilLoaded
from features.skill_loading.handlers import KeepRefusalCount, NameStaleSkills, NameUnloaded, OpenWindow, OweSessionSkills, OweSkills, ShowSkillLoad, UpgradeWindow
from features.skill_loading.listeners import (CountRefusals, SpotCommandNeedingSkill, SpotReload, SpotSessionStart, SpotSkillLoad, SpotSkillsTheUserNames,
                                              SpotStaleSkills, SpotUnloadedWindow)
from features.skill_loading.catalogue import handed
from features.session_briefing.start import SKILLS, START_PARTS
from features.skill_loading.commands import LoadSkill, SetKeywords, ShowSkill, ShowSkills
from features.skill_loading.routes import get_skill, get_skills, post_skill_always, post_skill_keywords, post_skill_load

CLAUDE = AgentRow(n=1, title="claude-1", data={"event": "PostToolUse", "skills": ["journal"]})
CLAUDE_TRANSCRIBED = AgentRow(n=1, title="claude-1", data={"provider": "claude", "event": "PostToolUse", "skills": ["journal"]})
LIBRARY = ".agents/skills"
PLANS = {f"{LIBRARY}/journal-plans/SKILL.md": "---\nname: journal-plans\nkeywords: roadmap\ncommands: plan\n---\n"}
JOURNAL = {f"{LIBRARY}/journal/SKILL.md": "---\nname: journal\n---\n"}


def marked(name: str = "skill_loading", **fields) -> dict:
    """The mark file the agent's triggers left for this name, as the play stages it before the registration runs."""
    return {f".journal/runtime/sessions/claude-1/trigger-{name}.json": json.dumps(asdict(Mark(**fields)))}


def asked(tool: str, input: str) -> ToolCallAsked:
    return ToolCallAsked(tool=tool, input=input, command=input if tool == "Bash" else "", session="claude-1")


def answered(tool: str, command: str = "", subagent: bool = False) -> ToolCallAnswered:
    return ToolCallAnswered(agent=1, tool=tool, command=command, subagent=subagent)


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
        journal.events.listen(AgentReported, SpotUnloadedWindow(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"event": "PostToolUse", "skills": []})]) >> Dispatches(JournalSkillMissing(agent=1).due()),
            Given(AgentReported(agent=1), rows=[CLAUDE]) >> Dispatches(nothing),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"event": "PreCompact", "skills": []})])
                >> Dispatches(WindowOpened(agent=1, uses=0, context=0.0, at=WHEN)) & Dispatches(JournalSkillMissing(agent=1).due()),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"event": "SessionStart", "skills": ["journal-todos"]})])
                >> Dispatches(WindowOpened(agent=1, uses=0, context=0.0, at=WHEN)),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"event": "PostToolUse", "skills": []})], files=answering(marked(notified=True))) >> Dispatches(nothing),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"event": "PostToolUse", "skills": []})], files=answering(marked(notified=False)))
                >> Dispatches(JournalSkillMissing(agent=1).due()),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"event": "PostToolUse", "skills": []})], files=answering(marked(at=5.0)))
                >> Dispatches(WindowUpgraded(agent=1)),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"event": "SessionStart", "skills": []})], files=answering(marked(notified=False, event="SessionStart")))
                >> Dispatches(JournalSkillMissing(agent=1).due()),
        ])
        journal.events.listen(AgentReported, SpotReload(), expects=[
            Given(AgentReported(agent=1), rows=[CLAUDE_TRANSCRIBED], transcript="{}\n", files=answering(marked(since=5.0))) >> Dispatches(SkillsOwed(agent=1, session="claude-1", skills=(("journal", 5.0),))),
            Given(AgentReported(agent=1), rows=[CLAUDE_TRANSCRIBED], transcript="{}\n", files=answering(marked(since=0.0))) >> Dispatches(nothing),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"provider": "claude"})]) >> Dispatches(nothing),
            Given(AgentReported(agent=1), rows=[CLAUDE], settings={"skill_loading.reload": False}) >> Dispatches(nothing),
        ])
        journal.events.listen(AgentReported, SpotStaleSkills(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
        ])
        journal.events.listen(SessionStarted, SpotSessionStart(), expects=[
            Given(SessionStarted(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(SessionOwesSkills(agent=1, session="claude-1", skills=())),
            Given(SessionStarted(agent=1), rows=[AgentRow(n=1, title="claude-1")], files=answering(JOURNAL))
                >> Dispatches(SessionOwesSkills(agent=1, session="claude-1", skills=(("journal", WHEN),))),
        ])
        journal.events.listen(MessageCreated, SpotSkillsTheUserNames(), expects=[
            Given(MessageCreated(n=3, type="message", actor="user"), rows=[AgentRow(n=1, title="claude-1"), Message(n=3, title="plan it", brief="here is the roadmap", seen=["user"])],
                  files=answering(PLANS)) >> Dispatches(SkillsOwed(agent=1, session="claude-1", skills=(("journal-plans", WHEN),))),
            Given(MessageCreated(n=3, type="message", actor="user"), rows=[AgentRow(n=1, title="claude-1"), Message(n=3, title="plan it", brief="nothing to see", seen=["user"])],
                  files=answering(PLANS)) >> Dispatches(nothing),
            Given(MessageCreated(n=3, type="message", actor="agent"), rows=[AgentRow(n=1, title="claude-1"), Message(n=3, title="the roadmap", brief="the roadmap")],
                  files=answering(PLANS)) >> Dispatches(nothing),
        ])
        journal.events.listen(ToolFinished, SpotSkillLoad(), expects=[
            Given(ToolFinished(agent=1, tool="Skill", skill="journal"), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(SkillLoaded(agent=1, skill="journal", at=WHEN)),
            Given(ToolFinished(agent=1, tool="Bash"), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
        ])
        journal.events.listen(ToolCallAnswered, SpotCommandNeedingSkill(), expects=[
            Given(answered("Bash", "journal plan phase 1 build --when done"), rows=[AgentRow(n=1, title="claude-1")], files=answering(PLANS))
                >> Dispatches(SkillsOwed(agent=1, session="claude-1", skills=(("journal-plans", 0.0),))),
            Given(answered("Bash", "journal plan phase 1 build --when done"), rows=[AgentRow(n=1, title="claude-1")], files=answering({**PLANS, **marked(since=7.0)}))
                >> Dispatches(SkillsOwed(agent=1, session="claude-1", skills=(("journal-plans", 7.0),))),
            Given(answered("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")], files=answering(PLANS)) >> Dispatches(nothing),
            Given(answered("Bash", "journal plan phase 1 build --when done", subagent=True), rows=[AgentRow(n=1, title="claude-1")], files=answering(PLANS)) >> Dispatches(nothing),
        ])
        journal.events.listen(ToolCallAnswered, CountRefusals(), expects=[
            Given(answered("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(RefusalCounted(agent=1, wanted=False)),
            Given(answered("Skill"), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
            Given(answered("Bash", "ls", subagent=True), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
        ])
        journal.events.handle(WindowOpened, OpenWindow(), expects=[
            Given(WindowOpened(agent=1, uses=4, context=30.0, at=WHEN), rows=[AgentRow(n=1, title="claude-1")])
                >> Remembered("trigger-skill_loading", asdict(Mark(notified=False, uses=4, context=30.0, since=WHEN))),
        ])
        journal.events.handle(WindowUpgraded, UpgradeWindow(), expects=[
            Given(WindowUpgraded(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Remembered("trigger-skill_loading", asdict(Mark(notified=True))),
        ])
        journal.events.handle(JournalSkillMissing, NameUnloaded(), expects=[
            Given(JournalSkillMissing(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Nudged("unloaded") & Remembered("trigger-skill_loading", asdict(Mark(notified=True))),
        ])
        journal.events.handle(SkillsOwed, OweSkills(), expects=[
            Given(SkillsOwed(agent=1, session="claude-1", skills=(("journal-plans", 5.0),)), rows=[AgentRow(n=1, title="claude-1")])
                >> Remembered("required.claude-1", {"journal-plans": 5.0}),
            Given(SkillsOwed(agent=1, session="claude-1", skills=(("journal-plans", 3.0),)), rows=[AgentRow(n=1, title="claude-1")],
                  remembered={"skill_loading.required.claude-1": {"journal-plans": 5.0}}) >> Remembered("required.claude-1", {"journal-plans": 5.0}),
        ])
        journal.events.handle(SessionOwesSkills, OweSessionSkills(), expects=[
            Given(SessionOwesSkills(agent=1, session="claude-1", skills=(("journal", 5.0),)), rows=[AgentRow(n=1, title="claude-1")],
                  remembered={"skill_loading.required.claude-1": {"journal-obsolete": 1.0}}) >> Remembered("required.claude-1", {"journal": 5.0}),
        ])
        journal.events.handle(StaleSkillsNamed, NameStaleSkills(), expects=[
            Given(StaleSkillsNamed(agent=1, skills="journal-plans"), rows=[AgentRow(n=1, title="claude-1")]) >> Nudged("stale", skills="journal-plans"),
        ])
        journal.events.handle(SkillLoaded, ShowSkillLoad(), expects=[
            Given(SkillLoaded(agent=1, skill="journal", at=WHEN), rows=[AgentRow(n=1, title="claude-1")]) >> Updated(AgentRow(n=1), skill_loads=[{"skill": "journal"}]),
        ])
        journal.events.handle(RefusalCounted, KeepRefusalCount(), expects=[
            Given(RefusalCounted(agent=1, wanted=True), rows=[AgentRow(n=1, title="claude-1")]) >> Remembered("trigger-skill_loading.refused", asdict(Mark(count=1))),
            Given(RefusalCounted(agent=1, wanted=False), rows=[AgentRow(n=1, title="claude-1")], files=answering(marked("skill_loading.refused", count=4)))
                >> Remembered("trigger-skill_loading.refused", asdict(Mark(count=0))),
            Given(RefusalCounted(agent=1, wanted=True), rows=[AgentRow(n=1, title="claude-1")], files=answering(marked("skill_loading.refused", count=4)))
                >> Remembered("trigger-skill_loading.refused", asdict(Mark(count=5))),
            Given(RefusalCounted(agent=1, wanted=True), rows=[AgentRow(n=1, title="claude-1")], files=answering(marked("skill_loading.refused", count=15)))
                >> Remembered("trigger-skill_loading.refused", asdict(Mark(count=1))),
        ])
        journal.events.answer(ToolCallAsked, RefuseUntilLoaded(), expects=[
            Given(asked("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")]) >> Answered(Allowed()),
            Given(asked("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")], remembered={"skill_loading.required.claude-1": {"journal-plans": 5.0}})
                >> Answered(RefusedCall("load journal-plans before anything else - every tool call waits until it is loaded: Skill: journal-plans")),
            Given(asked("Skill", '{"skill": "journal-plans"}'), rows=[AgentRow(n=1, title="claude-1")], remembered={"skill_loading.required.claude-1": {"journal-plans": 5.0}})
                >> Answered(Allowed()),
            Given(asked("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")], remembered={"skill_loading.required.claude-1": {"journal-plans": 5.0}},
                  settings={"skill_loading.most_refusals": 0}) >> Answered(Allowed()),
            Given(asked("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")], remembered={"skill_loading.required.claude-1": {"journal-plans": 5.0}},
                  files=answering(marked("skill_loading.refused", count=5))) >> Answered(Allowed()),
            Given(asked("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")], remembered={"skill_loading.required.claude-1": {"journal-plans": 5.0}},
                  files=answering(marked("skill_loading.refused", count=4)))
                >> Answered(RefusedCall("load journal-plans before anything else - every tool call waits until it is loaded: Skill: journal-plans")),
            Given(asked("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")], remembered={"skill_loading.required.claude-1": {"journal-plans": 5.0}},
                  files=answering(marked("skill_loading.refused", count=15))) >> Answered(RefusedCall("load journal-plans before anything else - every tool call waits until it is loaded: Skill: journal-plans")),
        ])
