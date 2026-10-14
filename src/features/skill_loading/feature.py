from dataclasses import asdict

from controllers.types import Agents
from declaring.trigger import Mark
from events.agents import AgentReported, SessionStarted, ToolCallAnswered, ToolFinished
from events.answers import Allowed
from events.asking import ToolCallAsked
from events.messages import MessageCreated
from events.skill_loading import JournalSkillMissing, RefusalCounted, SessionOwesSkills, SkillLoaded, SkillsAsked, SkillsOwed, StaleSkillsNamed, WindowOpened, WindowSpent
from expects import WHEN, Acted, Answered, Dispatches, Given, Nudged, Refused, Remembered, Replied, Requested, Reported, Told, Unchanged, Updated, Wrote, answering, nothing
from events.answers import Refused as RefusedCall
from framework.base import Feature
from resources.base import AGENT
from resources.types import AgentRow, Message
from framework.journal import Journal
from features.skill_loading.details import SkillLoadingDetails
from features.skill_loading.answering import RefuseCommandNeedingSkill, RefuseUntilLoaded
from features.skill_loading.handlers import AskPrimaryForSkills, KeepRefusalCount, NameStaleSkills, NameUnloaded, OpenWindow, OweSessionSkills, OweSkills, ShowSkillLoad, SpendWindow
from features.skill_loading.listeners import (IN_THIS_WINDOW, CountRefusals, SpotCommandNeedingSkill, SpotReload, SpotSessionStart, SpotSkillLoad, SpotSkillsTheUserNames,
                                              SpotStaleSkills, SpotUnloadedWindow)
from features.skill_loading.catalogue import handed
from declaring.registries import SKILLS, START_PARTS
from features.skill_loading.commands import LoadSkill, SetKeywords, ShowSkill, ShowSkills
from features.skill_loading.routes import get_skill, get_skills, post_skill_always, post_skill_keywords, post_skill_load

CLAUDE = AgentRow(n=1, title="claude-1", data={"event": "PostToolUse", "skills": ["journal"]})
CLAUDE_TRANSCRIBED = AgentRow(n=1, title="claude-1", data={"provider": "claude", "event": "PostToolUse", "skills": ["journal"]})
LIBRARY = ".agents/skills"
PLANS = {f"{LIBRARY}/journal-plans/SKILL.md": "---\nname: journal-plans\nkeywords: roadmap\ncommands: plan\n---\n"}
JOURNAL = {f"{LIBRARY}/journal/SKILL.md": "---\nname: journal\n---\n"}
CODEX = AgentRow(n=1, title="codex-1", data={"provider": "codex"})
OWED_TO_CODEX = {"skill_loading.required.codex-1": {"journal-plans": 5.0}}
USE = Reported("working", "PreToolUse", skills=[])




def asked(tool: str, input: str) -> ToolCallAsked:
    return ToolCallAsked(tool=tool, input=input, command=input if tool == "Bash" else "", session="claude-1")


def answered(tool: str, command: str = "", subagent: bool = False) -> ToolCallAnswered:
    return ToolCallAnswered(agent=1, tool=tool, command=command, subagent=subagent)


class SkillLoading(Feature):
    details = SkillLoadingDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_skills, expects=[
            Given(Requested(), files=answering({".claude/skills/journal-obsolete/SKILL.md": '---\nname: journal-obsolete\ndescription: "Old skill"\n---\n\n# Old\n'}))
                >> Replied(200, [{"name": "journal-obsolete", "description": "Old skill", "path": ".claude/skills/journal-obsolete/SKILL.md"}]),
            Given(Requested(), files=answering({f"{LIBRARY}/journal-work-tracking/SKILL.md": '---\nname: journal-work-tracking\ndescription: "Auto mode"\n---\n\n# Auto\n'}))
                >> Replied(200, [{"name": "journal-work-tracking", "description": "Auto mode", "path": f"{LIBRARY}/journal-work-tracking/SKILL.md", "loaded": 0, "stale": False, "always": False}]),
            Given(Requested(), files=answering({f"{LIBRARY}/journal-lean/SKILL.md": "---\nname: journal-lean\n---\n", f"{LIBRARY}/journal-todos/SKILL.md": "---\nname: journal-todos\n---\n"}))
                >> Replied(200, [{"name": "journal-lean", "always": True}, {"name": "journal-todos", "always": True}]),
            Given(Requested(), files=answering({f"{LIBRARY}/lint-rules/SKILL.md": "---\nname: lint-rules\nplugin: linter\nkeywords: sinful, lint\n---\n"}))
                >> Replied(200, [{"name": "lint-rules", "keywords": ["sinful", "lint"]}]),
        ])
        journal.routes.add(post_skill_load, expects=[
            Given(Requested(name="journal-demo"), files=answering({".agents/skills/journal-demo/SKILL.md": '---\nname: journal-demo\ndescription: "A demo"\n---\n\n# Demo\n'}))
                >> Replied(200, {"notice": "the agent is asked, and its tool calls wait until the skill is loaded"}),
        ])
        journal.routes.add(post_skill_always, expects=[
            Given(Requested({"on": True}, name="journal-work-tracking"), files=answering({f"{LIBRARY}/journal-work-tracking/SKILL.md": "---\nname: journal-work-tracking\n---\n"}))
                >> Replied(200, {"skills": ["journal-work-tracking"]}),
            Given(Requested({"on": False}, name="journal-lean"),
                  files=answering({f"{LIBRARY}/journal-lean/SKILL.md": "---\nname: journal-lean\n---\n", f"{LIBRARY}/journal-todos/SKILL.md": "---\nname: journal-todos\n---\n"}))
                >> Replied(200, {"skills": ["journal-todos"]}),
        ])
        journal.routes.add(get_skill, expects=[
            Given(Requested(name="no-such-skill")) >> Refused("no skill no-such-skill"),
            Given(Requested(name="journal-demo"), files=answering({".agents/skills/journal-demo/SKILL.md": '---\nname: journal-demo\ndescription: "A demo"\n---\n\n# Demo\n'}))
                >> Replied(200, {"description": "A demo"}),
        ])
        journal.routes.add(post_skill_keywords, expects=[
            Given(Requested({"keywords": " roadmap, ,"}, name="journal-plans")) >> Replied(200, {"keywords": ["roadmap"]}),
            Given(Requested({"keywords": ["roadmap", " "]}, name="journal-plans")) >> Replied(200, {"keywords": ["roadmap"]}),
        ])
        journal.commands.add("agent", ShowSkills(), expects=[Given((Agents,)) >> Answered([])])
        journal.commands.add("agent", ShowSkill(), expects=[Given((Agents, "journal")) >> Refused("no skill journal")])
        journal.commands.add("agent", LoadSkill(), expects=[
            Given((Agents, "journal"), rows=[AgentRow(n=1, title="claude-1")], files=answering(JOURNAL))
                >> Answered({"notice": "the agent is asked, and its tool calls wait until the skill is loaded"}) & Wrote(Message(title="Please load the journal skill now")) & Remembered("required.claude-1"),
            Given(Acted(Agents, "load_skill", "journal-plans", by=AGENT)) >> Refused("only the user may agent load_skill: they do it from the viewer"),
            Given((Agents, "journal"), rows=[AgentRow(n=1, title="claude-1")]) >> Answered({"notice": "the agent is asked, and its tool calls wait until the skill is loaded"})
                & Wrote(Message(title="Please load the journal skill now")),
        ])
        journal.commands.add("agent", SetKeywords(), expects=[
            Given((Agents, "journal", [" notes ", "plans", " "])) >> Answered({"keywords": ["notes", "plans"]}),
        ])
        START_PARTS.add(self, handed, key=SKILLS)
        journal.events.listen(AgentReported, SpotUnloadedWindow(), expects=[
            Given(USE, earlier=(USE,) * 24) >> Told("unloaded"),
            Given(USE, earlier=(USE,) * 23) >> Told("unloaded", times=0),
            Given(USE, earlier=(USE,) * 49) >> Told("unloaded"),
            Given(Reported("working", "PreToolUse", skills=["journal", "journal-todos"]), earlier=(Reported("working", "PreToolUse", skills=["journal", "journal-todos"]),) * 29)
                >> Told("unloaded", times=0),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"event": "PostToolUse", "skills": []})]) >> Dispatches(JournalSkillMissing(agent=1).due()),
            Given(AgentReported(agent=1), rows=[CLAUDE]) >> Dispatches(WindowSpent(agent=1).due()),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"event": "PreCompact", "skills": []})])
                >> Dispatches(WindowOpened(agent=1, uses=0, context=0.0, at=WHEN)) & Dispatches(JournalSkillMissing(agent=1).due()),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"event": "SessionStart", "skills": ["journal-todos"]})])
                >> Dispatches(WindowOpened(agent=1, uses=0, context=0.0, at=WHEN)) & Dispatches(WindowSpent(agent=1).due()),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"event": "PostToolUse", "skills": []})], files=answering(Mark.staged("skill_loading", notified=True))) >> Dispatches(nothing),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"event": "PostToolUse", "skills": []})], files=answering(Mark.staged("skill_loading", notified=False)))
                >> Dispatches(JournalSkillMissing(agent=1).due()),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"event": "PostToolUse", "skills": []})], files=answering(Mark.staged("skill_loading", at=5.0)))
                >> Dispatches(WindowSpent(agent=1)),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"event": "SessionStart", "skills": []})], files=answering(Mark.staged("skill_loading", notified=False, event="SessionStart")))
                >> Dispatches(JournalSkillMissing(agent=1).due()),
        ])
        journal.events.listen(AgentReported, SpotReload(), expects=[
            Given(AgentReported(agent=1), rows=[CLAUDE_TRANSCRIBED], transcript="{}\n", files=answering(Mark.staged("skill_loading", since=5.0))) >> Dispatches(SkillsOwed(agent=1, session="claude-1", skills=(("journal", 5.0),))),
            Given(AgentReported(agent=1), rows=[CLAUDE_TRANSCRIBED], transcript="{}\n", files=answering(Mark.staged("skill_loading", since=0.0))) >> Dispatches(nothing),
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"provider": "claude"})]) >> Dispatches(nothing),
            Given(AgentReported(agent=1), rows=[CLAUDE], settings={"skill_loading.reload": False}) >> Dispatches(nothing),
        ])
        journal.events.listen(AgentReported, SpotStaleSkills(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
        ])
        journal.events.listen(SessionStarted, SpotSessionStart(), expects=[
            Given(SessionStarted(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(SessionOwesSkills(agent=1, session="claude-1", skills=())),
            Given(SessionStarted(agent=1), rows=[AgentRow(n=1, title="claude-1")], files=answering(JOURNAL))
                >> Dispatches(SessionOwesSkills(agent=1, session="claude-1", skills=(("journal", IN_THIS_WINDOW),))),
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
            Given(ToolFinished(agent=1, tool="Skill", skill="journal"), rows=[AgentRow(n=1, title="claude-1")], settings={".skill_loading.chat": False}) >> Dispatches(nothing),
        ])
        journal.events.listen(ToolCallAnswered, SpotCommandNeedingSkill(), expects=[
            Given(answered("Bash", "journal plan phase 1 build --when done"), rows=[AgentRow(n=1, title="claude-1")], files=answering(PLANS))
                >> Dispatches(SkillsOwed(agent=1, session="claude-1", skills=(("journal-plans", 0.0),))),
            Given(answered("Bash", "journal plan phase 1 build --when done"), rows=[AgentRow(n=1, title="claude-1")], files=answering({**PLANS, **Mark.staged("skill_loading", since=7.0)}))
                >> Dispatches(SkillsOwed(agent=1, session="claude-1", skills=(("journal-plans", 7.0),))),
            Given(answered("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")], files=answering(PLANS)) >> Dispatches(nothing),
            Given(answered("Bash", "journal plan phase 1 build --when done", subagent=True), rows=[AgentRow(n=1, title="claude-1")], files=answering(PLANS)) >> Dispatches(nothing),
        ])
        journal.events.listen(ToolCallAnswered, CountRefusals(), expects=[
            Given(answered("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(RefusalCounted(agent=1, wanted=False)),
            Given(answered("Bash", "journal plan phase 1 build --when done"), rows=[AgentRow(n=1, title="claude-1")], files=answering(PLANS))
                >> Dispatches(RefusalCounted(agent=1, wanted=True)),
            Given(answered("Skill"), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
            Given(answered("Bash", "ls", subagent=True), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
        ])
        journal.events.handle(WindowOpened, OpenWindow(), expects=[
            Given(WindowOpened(agent=1, uses=4, context=30.0, at=WHEN), rows=[AgentRow(n=1, title="claude-1")])
                >> Remembered("trigger-skill_loading", asdict(Mark(notified=False, uses=4, context=30.0, since=WHEN))),
        ])
        journal.events.handle(WindowSpent, SpendWindow(), expects=[
            Given(WindowSpent(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Remembered("trigger-skill_loading", asdict(Mark(notified=True))),
        ])
        journal.events.handle(JournalSkillMissing, NameUnloaded(), expects=[
            Given(JournalSkillMissing(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Nudged("unloaded") & Remembered("trigger-skill_loading", asdict(Mark(notified=True))),
        ])
        journal.events.handle(SkillsOwed, OweSkills(), expects=[
            Given(SkillsOwed(agent=1, session="claude-1", skills=(("journal-plans", 5.0),)), rows=[AgentRow(n=1, title="claude-1")])
                >> Remembered("required.claude-1", {"journal-plans": 5.0}),
            Given(SkillsOwed(agent=1, session="claude-1", skills=(("journal-plans", 3.0),)), rows=[AgentRow(n=1, title="claude-1")],
                  remembered={"skill_loading.required.claude-1": {"journal-plans": 5.0}}) >> Remembered("required.claude-1", {"journal-plans": 5.0}),
            Given(SkillsOwed(agent=1, session="claude-1", skills=(("journal-plans", 5.0),)), rows=[AgentRow(n=1, title="claude-1")],
                  remembered={"skill_loading.required.claude-1": {"journal": 1.0}}) >> Remembered("required.claude-1", {"journal": 1.0, "journal-plans": 5.0}),
        ])
        journal.events.handle(SkillsAsked, AskPrimaryForSkills(), expects=[
            Given(SkillsAsked(agent=1, names="lint-rules,not-installed", at=5.0), rows=[AgentRow(n=1, title="claude-1")],
                  files=answering({f"{LIBRARY}/lint-rules/SKILL.md": "---\nname: lint-rules\n---\n"})) >> Remembered("required.claude-1", {"lint-rules": 5.0}),
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
            Given(SkillLoaded(agent=1, skill="journal", at=WHEN), rows=[AgentRow(n=1, title="claude-1", data={"skill_loads": [{"skill": "a", "at": 1.0}]})])
                >> Updated(AgentRow(n=1), skill_loads=[{"skill": "a"}, {"skill": "journal"}]),
        ])
        journal.events.handle(RefusalCounted, KeepRefusalCount(), expects=[
            Given(RefusalCounted(agent=1, wanted=True), rows=[AgentRow(n=1, title="claude-1")]) >> Remembered("trigger-skill_loading.refused", asdict(Mark(count=1))),
            Given(RefusalCounted(agent=1, wanted=False), rows=[AgentRow(n=1, title="claude-1")], files=answering(Mark.staged("skill_loading.refused", count=4)))
                >> Remembered("trigger-skill_loading.refused", asdict(Mark(count=0))),
            Given(RefusalCounted(agent=1, wanted=True), rows=[AgentRow(n=1, title="claude-1")], files=answering(Mark.staged("skill_loading.refused", count=4)))
                >> Remembered("trigger-skill_loading.refused", asdict(Mark(count=5))),
            Given(RefusalCounted(agent=1, wanted=True), rows=[AgentRow(n=1, title="claude-1")], files=answering(Mark.staged("skill_loading.refused", count=15)))
                >> Remembered("trigger-skill_loading.refused", asdict(Mark(count=1))),
        ])
        journal.events.answer(ToolCallAsked, RefuseCommandNeedingSkill(), expects=[
            Given(asked("Bash", "journal plan phase 1 build --when done"), rows=[AgentRow(n=1, title="claude-1")], files=answering(PLANS))
                >> Answered(RefusedCall("load journal-plans before anything else - every tool call waits until it is loaded: Skill: journal-plans")),
            Given(asked("Bash", "journal plan phase 1 build --when done"), rows=[AgentRow(n=1, title="claude-1")], files=answering({**PLANS, **Mark.staged("skill_loading.refused", count=5)}))
                >> Answered(Allowed()),
            Given(asked("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")], files=answering(PLANS)) >> Answered(Allowed()),
        ])
        journal.events.answer(ToolCallAsked, RefuseUntilLoaded(), expects=[
            Given(ToolCallAsked(tool="exec", input="ls", command="", session="codex-1"), rows=[CODEX], remembered=OWED_TO_CODEX)
                >> Answered(RefusedCall("load journal-plans before anything else - every tool call waits until it is loaded: read .agents/skills/journal-plans/SKILL.md")),
            Given(ToolCallAsked(tool="exec", input="sed -n '1,200p' .agents/skills/journal-plans/SKILL.md", command="", session="codex-1"), rows=[CODEX], remembered=OWED_TO_CODEX)
                >> Answered(Allowed()),
            Given(asked("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")]) >> Answered(Allowed()),
            Given(asked("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")], remembered={"skill_loading.required.claude-1": {"journal-plans": 5.0}})
                >> Answered(RefusedCall("load journal-plans before anything else - every tool call waits until it is loaded: Skill: journal-plans")),
            Given(asked("Skill", '{"skill": "journal-plans"}'), rows=[AgentRow(n=1, title="claude-1")], remembered={"skill_loading.required.claude-1": {"journal-plans": 5.0}})
                >> Answered(Allowed()),
            Given(asked("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")], remembered={"skill_loading.required.claude-1": {"journal-plans": 5.0}},
                  settings={"skill_loading.most_refusals": 0}) >> Answered(Allowed()),
            Given(asked("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")], remembered={"skill_loading.required.claude-1": {"journal-plans": 5.0}},
                  files=answering(Mark.staged("skill_loading.refused", count=5))) >> Answered(Allowed()),
            Given(asked("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")], remembered={"skill_loading.required.claude-1": {"journal-plans": 5.0}},
                  files=answering(Mark.staged("skill_loading.refused", count=4)))
                >> Answered(RefusedCall("load journal-plans before anything else - every tool call waits until it is loaded: Skill: journal-plans")),
            Given(asked("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")], remembered={"skill_loading.required.claude-1": {"journal-plans": 5.0}},
                  files=answering(Mark.staged("skill_loading.refused", count=15))) >> Answered(RefusedCall("load journal-plans before anything else - every tool call waits until it is loaded: Skill: journal-plans")),
            Given(asked("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")], remembered={"skill_loading.required.claude-1": {"journal-plans": 5.0}},
                  settings={"skill_loading.most_refusals": 2, "skill_loading.steps_aside": 2}, files=answering(Mark.staged("skill_loading.refused", count=3))) >> Answered(Allowed()),
            Given(asked("Bash", "ls"), rows=[AgentRow(n=1, title="claude-1")], remembered={"skill_loading.required.claude-1": {"journal": 5.0, "journal-plans": 5.0}})
                >> Answered(RefusedCall("load journal, journal-plans before anything else - every tool call waits until it is loaded: Skill: journal, Skill: journal-plans")),
        ])
