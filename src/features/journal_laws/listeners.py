from events import Fact
from events.agents import AgentMessageSent, ToolCallAnswered, ToolFinished
from events.journal_laws import LargerResult, LawMentioned, LongReadRefused
from features.journal_laws.details import LARGEST_RESULT
from features.journal_laws.laws import laws_for
from features.journal_laws.reading import long_read
from framework.recital import COMMANDS, WHISPER, answered_words, mentioned
from receiving import Listener
from resources.dumps import Dump
from resources.form_of_address import Profile
from serving import ReadFiles, ReadRemembered, ReadRows, Settings


def largest_key(agent: int) -> str:
    return f"largest|{agent}"


def mentions(agent: int, voice_laws, text_in) -> list[Fact]:
    return [LawMentioned(agent=agent, law=law.name, text=law.text).once(f"{agent}|law:{law.name}:{law.text}|{law.reason}")
            for law in voice_laws if mentioned(law.keywords, text_in(law.keywords_in))]


class SpotLawInCall(Listener[ToolCallAnswered]):
    def listen(self, event: ToolCallAnswered, settings: Settings, profiles: ReadRows[Profile]) -> list[Fact]:
        if event.why or event.subagent or not settings.is_on(WHISPER):
            return []
        return mentions(event.agent, laws_for(profiles.standing()), lambda scope: answered_words(event, scope))


class SpotLawInChat(Listener[AgentMessageSent]):
    def listen(self, event: AgentMessageSent, settings: Settings, profiles: ReadRows[Profile]) -> list[Fact]:
        if not settings.is_on(WHISPER):
            return []
        return mentions(event.agent, laws_for(profiles.standing()), lambda scope: "" if scope == COMMANDS else event.text)


class SpotLongReadRefused(Listener[ToolCallAnswered]):
    def listen(self, event: ToolCallAnswered, settings: Settings, files: ReadFiles, dumps: ReadRows[Dump]) -> list[Fact]:
        read = None if event.subagent or not event.why else long_read(event, settings, files, dumps)
        if read is None or read.reason != event.why:
            return []
        return [LongReadRefused(agent=event.agent, path=str(read.path), count=read.count, instead=read.instead)]


class SpotLargerResult(Listener[ToolFinished]):
    def listen(self, event: ToolFinished, settings: Settings, remembered: ReadRemembered) -> list[Fact]:
        if not settings.is_on(LARGEST_RESULT) or event.size < int(settings.result_floor) or event.size <= remembered.get(largest_key(event.agent), 0):
            return []
        return [LargerResult(agent=event.agent, tool=event.tool, size=event.size)]
