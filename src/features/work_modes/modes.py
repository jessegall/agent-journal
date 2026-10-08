from features.work_modes.details import BUILDER, MODE_SET, MODES, NAME, WorkModesDetails
from resources.base import Refused


def mode_of(record) -> str:
    kept = WorkModesDetails.values(record).mode
    return kept if kept in MODES else BUILDER


def pick(record, mode: str, actor: str) -> str:
    if mode not in MODES:
        raise Refused(f"the work mode is one of {', '.join(MODES)}, not {mode!r}")
    if mode_of(record) == mode:
        return mode
    record.change_setting(NAME, {"mode": mode})
    from features import running
    from features.work_modes.feature import WorkModes
    running(WorkModes).to_primary(record, MODE_SET, actor=actor, mode=mode, meaning=MODES[mode])
    return mode


def carried(record) -> str:
    mode = mode_of(record)
    return f"WORK MODE: {mode} — {MODES[mode]}." if mode != BUILDER else ""
