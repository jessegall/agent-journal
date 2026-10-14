from declaring.agent_types import AgentType
from features.agent_profiles.details import MODEL, AgentProfilesDetails
from framework.agent_types import written
from framework.base import Feature

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

    def settings_changed(self, record, actor: str) -> None:
        written(record.root.parent, record)
