from events import Fact
from events.agents import ClockTicked
from events.dumps import (DumpArrived, DumpChoiceMade, DumpChoiceOpen, DumpFilingStalled, DumpFiledAway, DumpQuestionAnswered,
                          DumpWritten, TranscriptPasted)
from events.messages import MessageUpdated
from receiving import Listener
from resources.base import COMPLETED
from resources.dumps import OWN_WORDS
from resources.text import plural
from resources.types import IDLE, AgentRow, Dump, Message
from serving import ReadRemembered, ReadRows


def chosen_fact(dump: Dump) -> list[Fact]:
    chosen = dump.data.get("chosen") or {}
    pick = int(chosen.get("pick", -1))
    claim = f"dump choice|{dump.n}:{chosen.get('at')}"
    if pick == OWN_WORDS:
        return []
    at = str(chosen.get("at"))
    return [(DumpChoiceOpen(n=dump.n, at=at) if pick < 0 else DumpChoiceMade(n=dump.n, label=chosen["label"], at=at)).once(claim)]


def answered_fact(dump: Dump) -> list[Fact]:
    answers = dump.data.get("answers") or []
    if not answers:
        return []
    return [DumpQuestionAnswered(n=dump.n, answer=answers[-1]["answer"], question=answers[-1]["question"]).once(f"dump answer|{dump.n}:{len(answers)}")]


def announced(dump: Dump) -> str:
    return f"announced|{dump.n}"


def unannounced(dump: Dump, remembered: ReadRemembered) -> bool:
    """A choice the agent has not been told yet: that write is the choice's own, and the filing nudges wait for the next."""
    chosen = dump.data.get("chosen") or {}
    return bool(chosen) and int(chosen.get("pick", -1)) != OWN_WORDS and remembered.get(announced(dump)) != str(chosen.get("at"))


class SpotDumpChoosing(Listener[DumpWritten]):
    def listen(self, event: DumpWritten, dumps: ReadRows[Dump], agents: ReadRows[AgentRow]) -> list[Fact]:
        dump = dumps.peek(event.n)
        return chosen_fact(dump) if dump.data.get("chosen") and agents.has_primary() else []


class SpotDumpFiling(Listener[DumpWritten]):
    def listen(self, event: DumpWritten, dumps: ReadRows[Dump], agents: ReadRows[AgentRow], remembered: ReadRemembered) -> list[Fact]:
        dump, in_hand = dumps.peek(event.n), dumps.in_hand()
        if unannounced(dump, remembered) or not agents.has_primary():
            return []
        facts = []
        if event.action == COMPLETED:
            if not dump.data.get("stopped"):
                facts.append(DumpFiledAway(n=dump.n, outcome=dump.outcome))
            if in_hand is None:
                return facts
            dump = in_hand
        elif getattr(in_hand, "n", 0) != dump.n:
            return []
        if answered := answered_fact(dump):
            return facts + answered
        waiting = [name for name in dump.item_names if not dump.item(name).insight]
        if waiting and not dump.completed:
            facts.append(DumpArrived(n=dump.n, items=plural(len(waiting), "item")))
        return facts


class SpotStalledFiling(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, dumps: ReadRows[Dump], agents: ReadRows[AgentRow]) -> list[Fact]:
        agent, dump = agents.peek(event.agent), dumps.in_hand()
        if agent.status != IDLE or dump is None or (dump.data.get("question") or {}).get("text"):
            return []
        left = [name for name in dump.item_names if not dump.item(name).settled]
        return [DumpFilingStalled(n=dump.n, items=plural(len(left), "item")).once(f"carried|{dump.n}:{agent.at}")] if left else []


class SpotTranscript(Listener[MessageUpdated]):
    def listen(self, event: MessageUpdated, messages: ReadRows[Message]) -> list[Fact]:
        message = messages.peek(event.n)
        if message.data.get("kind") != "transcript" or any(ref.startswith("dump:") for ref in message.refs):
            return []
        return [TranscriptPasted(message=message.n, actor=event.actor)]
