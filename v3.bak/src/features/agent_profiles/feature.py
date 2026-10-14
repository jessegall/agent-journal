from dataclasses import replace
from functools import reduce
from operator import and_

from declaring.agent_types import AgentType
from features.agent_profiles.details import MODEL, AgentProfilesDetails
from events.agent_profiles import ProfilesChosen
from events.features import FeatureUpdated
from expects import Dispatches, File, Given, Wrote, answering, nothing
from features.agent_profiles.handlers import WriteTheProfiles
from features.agent_profiles.listeners import SpotProfileModels
from framework.base import Feature
from framework.journal import Journal
from resources.base import USER

def written_for(name: str, tools: str) -> Wrote:
    """A profile for Claude on the model Settings chose and only the tools it names, and one for Codex on its model in a read-only sandbox."""
    return Wrote(File(f".claude/agents/{name}.md", f"tools: {tools}\nmodel: sonnet")) & Wrote(File(f".codex/agents/{name}.toml", 'model = "gpt-6-sol"\nsandbox_mode = "read-only"'))


CHANGED = FeatureUpdated(n=0, type="feature", action="updated", actor=USER, setting="agent_profiles")
MODELS = {"agent_profiles.profile_model": {"claude": "sonnet", "codex": "gpt-6-sol"}}
READS = "Read, Grep, Glob"
REPORTS = ("You only read: change no file, run no tests and write nothing to the journal; the agent that started you does the writing. "
           "Read narrowly: search for the line, read the range you need, never a whole large file. Answer in a short report written "
           "to the agent that started you, with the files and lines that show each point and what you could not check.")

PROFILES = (
    AgentType("researcher", "Researches a question in the code, the journal's record or on the web and reports what it found, with "
              "evidence. Read-only.", f"{READS}, WebFetch, WebSearch", MODEL,
              "You research one question. Find what already answers it before you look further: the code, the journal's record "
              "(journal search <term> and journal <type> show <n> are reads you may run) and, when the question is about something "
              f"outside the project, the web. Separate what you found from what you infer. {REPORTS}"),
    AgentType("planner", "Designs how to build a change: the files to touch, what already does part of it, the order of the steps and "
              "the risks. Read-only.", READS, MODEL,
              "You plan one change. Find what in the code already does the job or most of it, and plan to extend that rather than "
              "write a second way. Name every file to touch and why, the order of the steps, the tests that prove each, and what "
              f"could go wrong. {REPORTS}"),
    AgentType("debugger", "Traces a fault to where it starts and says the fix that belongs there. Read-only.", READS, MODEL,
              "You debug one fault. Start from what was observed, then walk back through the code to where the bad value, missing "
              "check or wrong shape is born, and name the fix there, never where the fault only shows. Say how to reproduce it and "
              f"which test would prove the fix. {REPORTS}"),
)


class AgentProfiles(Feature):
    details = AgentProfilesDetails
    agent_types = PROFILES

    def register(self, journal: Journal) -> None:
        journal.events.listen(FeatureUpdated, SpotProfileModels(), expects=[
            Given(CHANGED) >> Dispatches(ProfilesChosen()),
            Given(replace(CHANGED, setting="phone")) >> Dispatches(nothing),
        ])
        journal.events.handle(ProfilesChosen, WriteTheProfiles(), expects=[
            Given(ProfilesChosen(), files=answering({".claude/settings.json": "{}", ".codex/config.toml": ""}), settings=MODELS)
                >> reduce(and_, (written_for(kind.name, kind.tools) for kind in PROFILES)),
        ])
