from events.answers import Allowed, Answer, Refused
from events.asking import AgentDispatching, ToolCallAsked
from features.journal_laws.laws import laws_for, refusal
from features.journal_laws.reading import long_read
from receiving import Answerer
from resources.dumps import Dump
from resources.form_of_address import Profile
from serving import ReadFiles, ReadRows, Settings


class EnforceDispatchLaw(Answerer[AgentDispatching]):
    def answer(self, event: AgentDispatching, profiles: ReadRows[Profile]) -> Answer:
        why = "" if event.subagent else refusal(event, profiles.standing().naming)
        return Refused(why) if why else Allowed()


class RefuseWholeLongReads(Answerer[ToolCallAsked]):
    def answer(self, event: ToolCallAsked, settings: Settings, files: ReadFiles, dumps: ReadRows[Dump]) -> Answer:
        read = None if event.subagent else long_read(event, settings, files, dumps.folder())
        return Refused(read.reason) if read else Allowed()
