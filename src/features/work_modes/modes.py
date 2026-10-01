from controllers.types import Nudges
from resources.base import Refused

NAME = "work_modes"
BUILDER, ORCHESTRATOR, SOLO = "builder", "orchestrator", "solo"
MODES = {
    BUILDER: "you do the work yourself and send helpers or subagents when a job is better done beside you",
    ORCHESTRATOR: "you plan, send helpers and subagents to do the work, review what they bring back and merge it; "
                  "you write code yourself only for reviews and small fixes",
    SOLO: "you do all the work yourself: no subagents and no helpers",
}


def mode_of(record) -> str:
    kept = record.setting(NAME, {}).get("mode", BUILDER)
    return kept if kept in MODES else BUILDER


def pick(record, mode: str, actor: str) -> str:
    if mode not in MODES:
        raise Refused(f"the work mode is one of {', '.join(MODES)}, not {mode!r}")
    if mode_of(record) == mode:
        return mode
    record.set_setting(NAME, {**record.setting(NAME, {}), "mode": mode})
    Nudges(record, actor=actor)._to_primary(f"the user set the work mode to {mode}", f"From now on {MODES[mode]}.")
    return mode


def carried(record) -> str:
    mode = mode_of(record)
    return f"WORK MODE: {mode} — {MODES[mode]}." if mode != BUILDER else ""
