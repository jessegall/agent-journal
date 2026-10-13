from features.work_modes.details import WorkModesDetails
from framework.work_mode import CARRIED_IN, mode_of, pick, taking  # noqa: F401
from resources.base import Refused
from resources.work_modes import BOARD_SET, BUILDER, MODE_SET, MODES, NAME, NEW_WORK_TO_DOS, ORCHESTRATOR, board_in, filing_on, kept_mode  # noqa: F401


def board_of(record):
    from controllers.types import Boards
    from resources.base import SYSTEM
    return board_in(Boards(record, actor=SYSTEM), int(WorkModesDetails.values(record).board))


def filing(record) -> str:
    return filing_on(board_of(record) if mode_of(record) == ORCHESTRATOR else None)


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
