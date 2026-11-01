import time
from collections.abc import Sequence

from core.base.database.database import Database
from core.base.database.point_tally import Points
from core.base.driver.hook_event import HookEvent
from core.base.journal_home import JournalHome
from core.base.timing import Timing
from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING, HOOK_NUDGES_SETTING
from core.modules.settings.bindings.support.setting_values import SettingValues

HOOK_LIMIT_POINTS = 50
STATEMENTS_LOGGED = 5
TERMINAL_NUDGE_CHARACTERS = 300


class HookDurations:
    """What the developer settings show of a hook: in the terminal how long it took, from the first
    stamp of its request to now, the points it cost the database and each line the agent was
    sent; a hook that cost 50 points or more says so, is update_statements to runtime/costly-
    hooks.log and is told to the agent in one line, which hears of no hook under."""

    def __init__(self, timing: Timing, settings: SettingValues, database: Database, home: JournalHome) -> None:
        self.timing, self.settings, self.database, self.home = timing, settings, database, home
        self.begun = Points()

    def begin(self) -> None:
        self.begun = self.database.tally.points()

    def measured(self, event: HookEvent, environment_id: int, nudges: Sequence[str]) -> tuple[str, str]:
        """The text for the terminal, and the note for the agent, which is empty unless the hook
        went over its points."""
        shown: list[str] = []
        note = ""
        if self.timing.stamps and self.settings.value(HOOK_DURATIONS_SETTING, environment_id) is True:
            line, note = self.duration(event)
            shown.append(line)
        if self.settings.value(HOOK_NUDGES_SETTING, environment_id) is True:
            shown.extend(nudge[:TERMINAL_NUDGE_CHARACTERS] for nudge in nudges if nudge)
        return "\n".join(shown), note

    def duration(self, event: HookEvent) -> tuple[str, str]:
        milliseconds = (time.time_ns() // 1000 - self.timing.stamps[0][1]) // 1000
        points = self.database.tally.points().minus(self.begun)
        if points.total < HOOK_LIMIT_POINTS:
            return f"hook {event.event.value} {milliseconds} ms, {points.total} points ({points.line()})", ""
        line = f"hook {event.event.value} {milliseconds} ms, {points.total} points ({points.line()}), over the {HOOK_LIMIT_POINTS} a hook may cost"
        self.home.costly_hooks_log.parent.mkdir(parents=True, exist_ok=True)
        with self.home.costly_hooks_log.open("a") as log:
            log.write(f"{time.strftime('%H:%M:%S')} {line}\n")
            log.writelines(f"    {rows} rows: {sql}\n" for sql, rows in points.statements.most_common(STATEMENTS_LOGGED))
            log.writelines(f"    {count} writes: {sql}\n" for sql, count in points.update_statements.most_common(STATEMENTS_LOGGED))
        return line, f"[journal] a {event.event.value} hook cost {points.total} points ({points.line()}), over the {HOOK_LIMIT_POINTS} a hook may cost: cut what it reads"
