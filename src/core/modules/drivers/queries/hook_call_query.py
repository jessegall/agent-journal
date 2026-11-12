from collections.abc import Iterator, Sequence
from itertools import takewhile
from typing import Self

from engine.database.database import Database
from engine.database.kept_rows import KeptRows
from engine.database.statement import Statement
from engine.time.timestamp import Timestamp
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from engine.model.tables import Tables
from engine.query.conditions.less import Less
from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.query.conditions.maximum import Maximum
from engine.query.conditions.minimum import Minimum
from engine.query.conditions.equal import Equal
from engine.query.query import Query
from core.modules.drivers.models.support.views import tool_use_counts_select
from engine.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall
from engine.driver.search_category import CODE, GRAPHIFY

STOPS_READ = 20
MOST_DISPLAYED_PARTS = 500
CALL_BATCH_ROWS = 50
TURN_HOOKS = (HookEventName.SESSION_START, HookEventName.PROMPT, HookEventName.PRE_TOOL_USE, HookEventName.POST_TOOL_USE, HookEventName.POST_TOOL_USE_FAILURE, HookEventName.STOP)
TOOL_HOOKS = (HookEventName.PRE_TOOL_USE, HookEventName.POST_TOOL_USE, HookEventName.POST_TOOL_USE_FAILURE)
IDLE_LIMIT_SECONDS = 30
IDLE_HOOKS = (HookEventName.SESSION_START, HookEventName.STOP)
COMPACTION_LIMIT_SECONDS = 600


class HookCallQuery(Query[HookCall]):
    """Reads hook calls, with the questions the drivers module's rules ask of an agent's recent hooks.
    An agent is between turns when its last turn hook ended the turn, it was interrupted, or it came
    back from a compaction a person or the journal started, which leaves it at an empty prompt; an
    automatic compaction goes on with its turn."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows) -> None:
        super().__init__(database, tables, HookCall)
        self.kept = kept

    def agent(self, agent_id: int) -> Self:
        return self.filter(session_agent_id=agent_id)

    def stop_refusal_count(self, agent_id: int) -> int:
        stops = self.agent(agent_id).filter(hook=HookEventName.STOP).newest().limited(STOPS_READ)
        refused = [stop.answer == HookAnswer.REFUSED for stop in stops]
        return refused.index(False) if False in refused else len(refused)

    def last_stop_refused(self, agent_id: int) -> bool:
        stop = self.agent(agent_id).filter(hook=HookEventName.STOP).newest().first()
        return stop is not None and stop.answer == HookAnswer.REFUSED

    def refused_stop_exists(self, agent_id: int, after_at: Timestamp, cutoff_at: Timestamp) -> bool:
        return self.agent(agent_id).filter(hook=HookEventName.STOP, answer=HookAnswer.REFUSED).matching(Greater("created_at", after_at.text)).matching(Maximum("created_at", cutoff_at.text)).exists()

    def displayed_block(self, agent_id: int, event: HookEvent) -> str:
        if not event.is_final_display:
            return ""
        part_calls = takewhile(lambda call: call.displayed_part != "" and call.displayed_message_id == event.displayed_message_id, self.newest_calls(agent_id, HookEventName.MESSAGE_DISPLAY, MOST_DISPLAYED_PARTS))
        return "".join([*(call.displayed_part for call in reversed(list(part_calls))), event.displayed_part]).strip()

    def newest_calls(self, agent_id: int, hook: HookEventName, most: int) -> Iterator[HookCall]:
        hook_calls = self.agent(agent_id).filter(hook=hook).newest()
        calls = hook_calls.limited(min(most, CALL_BATCH_ROWS))
        for read_count in range(CALL_BATCH_ROWS, most + CALL_BATCH_ROWS, CALL_BATCH_ROWS):
            yield from calls
            if len(calls) < CALL_BATCH_ROWS or read_count >= most:
                return
            calls = hook_calls.matching(Less("id", calls[-1].id)).limited(min(most - read_count, CALL_BATCH_ROWS))

    def latest_turn_call(self, agent_id: int) -> HookCall | None:
        return self.kept.read_newest(self.table.name, self.agent(agent_id).matching(Among("hook", TURN_HOOKS)).newest().first,
                                     "session_agent_id = ? AND hook IN (?, ?, ?, ?, ?, ?)", [agent_id, *TURN_HOOKS], name="drivers.latest_turn")

    def latest_session_end(self, agent_id: int) -> HookCall | None:
        return self.agent(agent_id).filter(hook=HookEventName.SESSION_END).newest().first()

    def latest_compaction(self, agent_id: int) -> HookCall | None:
        return self.agent(agent_id).filter(hook=HookEventName.COMPACT).newest().first()

    def display_calls_after_turn(self, agent_id: int) -> Sequence[HookCall]:
        latest = self.latest_turn_call(agent_id)
        return tuple(self.agent(agent_id).filter(hook=HookEventName.MESSAGE_DISPLAY).matching(Greater("id", latest.id if latest is not None else 0)).oldest().all_rows())

    def latest_prompt(self, agent_id: int, cutoff_at: Timestamp) -> HookCall | None:
        return self.kept.read_newest(self.table.name, self.agent(agent_id).filter(hook=HookEventName.PROMPT).matching(Maximum("created_at", cutoff_at.text)).newest().first,
                                     "session_agent_id = ? AND hook = ? AND created_at <= ?", [agent_id, HookEventName.PROMPT, cutoff_at.text], name="drivers.prompt_before")

    def last_allowed_stop(self, agent_id: int, cutoff_at: Timestamp) -> HookCall | None:
        return self.agent(agent_id).filter(hook=HookEventName.STOP, answer=HookAnswer.ALLOWED).matching(Maximum("created_at", cutoff_at.text)).newest().first()

    def latest_file_edit_call(self, agent_id: int) -> HookCall | None:
        return self.kept.read_newest(self.table.name, self.agent(agent_id).filter(writes_files=True).newest().first,
                                     "session_agent_id = ? AND writes_files = 1", [agent_id], name="drivers.latest_write")

    def has_call_after(self, agent_id: int, hook: HookEventName, summary: str, cutoff_at: Timestamp) -> bool:
        return self.agent(agent_id).filter(hook=hook, summary=summary).matching(Minimum("created_at", cutoff_at.text)).exists()

    def next_turn_event(self, agent_id: int, cutoff_at: Timestamp) -> HookCall | None:
        events = (HookEventName.PROMPT, HookEventName.STOP, *TOOL_HOOKS)
        return self.agent(agent_id).matching(Among("hook", events)).matching(Greater("created_at", cutoff_at.text)).oldest().first()

    def code_searches_after_graphify(self, agent_id: int, tool_uses: int) -> int:
        count = 0
        for call in self.newest_calls(agent_id, HookEventName.PRE_TOOL_USE, tool_uses):
            if call.search_category == GRAPHIFY:
                break
            count += call.search_category == CODE
        return count

    def has_tool_hook_after(self, agent_id: int, cutoff_at: Timestamp) -> bool:
        return self.agent(agent_id).matching(Among("hook", TOOL_HOOKS)).matching(Greater("created_at", cutoff_at.text)).exists()

    def is_idle(self, agent_id: int, checked_at: Timestamp) -> bool:
        call = self.latest_turn_call(agent_id)
        if call is None:
            return False
        return call.creation_timestamp().elapsed_seconds(checked_at) >= IDLE_LIMIT_SECONDS or self.has_ended_turn(agent_id)

    def has_ended_turn(self, agent_id: int) -> bool:
        call = self.latest_turn_call(agent_id)
        if call is None:
            return False
        if call.is_compaction_start:
            return call.answer == HookAnswer.ALLOWED and self.is_after_manual_compaction(agent_id)
        return (call.hook in IDLE_HOOKS and call.answer == HookAnswer.ALLOWED) or call.is_interrupted

    def is_after_manual_compaction(self, agent_id: int) -> bool:
        compaction = self.latest_compaction(agent_id)
        return compaction is not None and compaction.is_manual_compaction

    def is_compacting(self, agent_id: int, checked_at: Timestamp) -> bool:
        call = self.kept.read_newest(self.table.name, self.agent(agent_id).matching(Among("hook", (*TURN_HOOKS, HookEventName.COMPACT))).newest().first,
                                     "session_agent_id = ? AND hook IN (?, ?, ?, ?, ?, ?, ?)", [agent_id, *TURN_HOOKS, HookEventName.COMPACT], name="drivers.latest_compaction_turn")
        return call is not None and call.is_compaction and call.creation_timestamp().elapsed_seconds(checked_at) < COMPACTION_LIMIT_SECONDS

    def write_count(self, agent_id: int, timestamp: Timestamp) -> int:
        return self.agent(agent_id).filter(writes_files=True, answer=HookAnswer.ALLOWED).matching(Minimum("created_at", timestamp.text)).count()

    def tool_call_count(self, agent_id: int, timestamp: Timestamp) -> int:
        return self.agent(agent_id).filter(hook=HookEventName.PRE_TOOL_USE).matching(Minimum("created_at", timestamp.text)).count()

    def tool_use_counts(self, agent_id: int, starts: Sequence[Timestamp]) -> list[int]:
        parameters = (*(start.text for start in starts), agent_id, HookEventName.PRE_TOOL_USE.value, min(start.text for start in starts))
        row = self.database.rows(Statement(tool_use_counts_select(len(starts)), parameters))[0]
        return [int(count) for count in row]

    def newest_agent_hook(self, agent_id: int) -> HookCall | None:
        return self.kept.read_newest(self.table.name, self.agent(agent_id).matching(Equal("hook", HookEventName.TICK, negated=True)).newest().first,
                                     "session_agent_id = ? AND hook <> ?", [agent_id, HookEventName.TICK], name="drivers.latest_agent_hook")
