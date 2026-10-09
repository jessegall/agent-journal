from features.work_modes.details import BOARD_SET, BUILDER, MODE_SET, MODES, NAME, NEW_WORK_TO_DOS, ORCHESTRATOR, WorkModesDetails
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


def board_of(record):
    from features.boards.controller import Boards
    from resources.base import SYSTEM
    n = int(WorkModesDetails.values(record).board)
    boards = Boards(record, actor=SYSTEM)
    return boards.load(n) if n and boards.rows.exists(n) and not boards.load(n).finished else None


def filing(record) -> str:
    board = board_of(record) if mode_of(record) == ORCHESTRATOR else None
    if not board:
        return f"file new work as to-dos: {NEW_WORK_TO_DOS}"
    return (f"file each new request as a ticket on board {board.n}, {board.title}: journal ticket create \"<the work>\" --brief \"<what is wanted>\" "
            f"--set board={board.n}, then journal ticket start <n>; its agent plans it and you review, approve and merge, never a to-do")


def choose_board(record, n: int, actor: str) -> int:
    from features.boards.controller import Boards
    from resources.base import SYSTEM
    boards = Boards(record, actor=SYSTEM)
    if n and not boards.rows.exists(n):
        raise Refused(f"there is no board {n} to send new work to")
    if int(WorkModesDetails.values(record).board) == n:
        return n
    record.change_setting(NAME, {"board": n})
    from features import running
    from features.work_modes.feature import WorkModes
    where = f"board {n}, {boards.load(n).title}" if n else "to-dos"
    running(WorkModes).to_primary(record, BOARD_SET, actor=actor, where=where, filing=filing(record))
    return n


def carried(record) -> str:
    mode = mode_of(record)
    lines = [f"WORK MODE: {mode} — {MODES[mode]}." if mode != BUILDER else "", f"NEW WORK: {filing(record)}." if board_of(record) and mode == ORCHESTRATOR else ""]
    return "\n".join(line for line in lines if line)
