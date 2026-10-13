from features.work_modes.details import BOARD_SET, BUILDER, MODE_SET, MODES, NAME, NEW_WORK_TO_DOS, ORCHESTRATOR, WorkModesDetails
from resources.extension import Extension
from resources.base import Refused

CARRIED_IN = Extension()
"""The writers of the files that carry the mode's words, each taking the project folder and the record; a feature that writes such a file registers here, so the mode is picked without knowing who writes them."""


def kept_mode(kept: str) -> str:
    return kept if kept in MODES else BUILDER


def mode_of(record) -> str:
    return kept_mode(WorkModesDetails.values(record).mode)


def pick(record, mode: str, actor: str) -> str:
    if mode not in MODES:
        raise Refused(f"the work mode is one of {', '.join(MODES)}, not {mode!r}")
    if mode_of(record) == mode:
        return mode
    record.change_setting(NAME, {"mode": mode})
    record.emit("feature", 0, "updated", actor, setting=NAME)
    from framework.loaded import running
    from features.work_modes.feature import WorkModes
    for write in CARRIED_IN.each():
        write(record.root.parent, record)
    running(WorkModes).to_running(record, MODE_SET, actor=actor, mode=mode, written=MODES[mode].written)
    return mode


def taking(record) -> str:
    """What the mode this environment is in says to do with the next ready row."""
    return MODES[mode_of(record)].taking


def board_in(boards, n: int):
    return boards.load(n) if n and boards.rows.exists(n) and not boards.load(n).finished else None


def board_of(record):
    from controllers.types import Boards
    from resources.base import SYSTEM
    return board_in(Boards(record, actor=SYSTEM), int(WorkModesDetails.values(record).board))


def filing(record) -> str:
    return filing_on(board_of(record) if mode_of(record) == ORCHESTRATOR else None)


def filing_on(board) -> str:
    if not board:
        return f"file new work as to-dos: {NEW_WORK_TO_DOS}"
    return (f"file each new request as a ticket on board {board.n}, {board.title}: journal ticket create \"<the work>\" --brief \"<what is wanted>\" "
            f"--set board={board.n}, then journal ticket start <n>; its agent plans it and you review, approve and merge, never a to-do")


def choose_board(record, n: int, actor: str) -> int:
    from controllers.types import Boards
    from resources.base import SYSTEM
    boards = Boards(record, actor=SYSTEM)
    if n and not boards.rows.exists(n):
        raise Refused(f"there is no board {n} to send new work to")
    if int(WorkModesDetails.values(record).board) == n:
        return n
    record.change_setting(NAME, {"board": n})
    from framework.loaded import running
    from features.work_modes.feature import WorkModes
    board = boards.load(n) if n else None
    where = f"board {n}, {board.title}" if board else "to-dos"
    running(WorkModes).to_running(record, BOARD_SET, actor=actor, where=where, filing=filing_on(board))
    return n


def carried(record) -> str:
    mode = mode_of(record)
    lines = [f"WORK MODE: {mode} — {MODES[mode].meaning}." if mode != BUILDER else "", f"NEW WORK: {filing(record)}." if board_of(record) and mode == ORCHESTRATOR else ""]
    return "\n".join(line for line in lines if line)
