import time

from engine.worktree import current_branch
from features.work_modes.details import ORCHESTRATOR
from features.work_modes.modes import pick
from resources.base import PAUSED, RESUMED, Refused, STARTED, SYSTEM
from controllers.marks import action


class RunningBoards:
    @action
    def start(self, n: int):
        board = self.load(n)
        if not board.branch and current_branch(self.record.root.parent):
            board = self.update(board.n, branch=current_branch(self.record.root.parent))
        board = self.update(board.n, started=board.started or time.time(), orchestrator=self.record.env, orchestrator_approves_plans=True,
                            orchestrator_accepts_waits=True, orchestrator_confirms_drafts=True)
        pick(self.record, ORCHESTRATOR, self.actor)
        self._set_orchestrating(True)
        self.record.emit("board", board.n, STARTED, self.actor)
        return board

    @action
    def orchestrate(self, mode: str):
        if mode not in ("on", "off"):
            raise Refused(f"orchestrating is on or off; not {mode!r}")
        self._set_orchestrating(mode == "on")
        if mode == "off":
            self._finish_orchestration_runs()
        return f"{self.record.env} {'orchestrates its boards: you only delegate' if mode == 'on' else 'does not orchestrate: you work as usual'}"

    def _finish_orchestration_runs(self) -> None:
        from features.sequences.controller import Sequences
        from features.boards.orchestrating import ORCHESTRATING_MOMENTS, ORCHESTRATION
        from features.sequences.resource import RunKey
        sequences = Sequences(self.record, actor=SYSTEM)
        for shipped in (ORCHESTRATION, *ORCHESTRATING_MOMENTS):
            sequence = sequences.rows.by_title(shipped.title)
            if not sequence:
                continue
            for run in [run for run in map(RunKey.of, sequence.runs) if run.here(self.record.env)]:
                sequences.finish(sequence.n, run.about)

    def _set_orchestrating(self, on: bool) -> None:
        from features.session_briefing.block import rebuild
        self.record.change_setting("boards", {"orchestrating": on})
        rebuild(self.record)

    @action
    def pause(self, n: int):
        board = self.load(n)
        if not board.started or board.paused:
            raise Refused(f"board {board.n} is not running, so there is nothing to pause")
        board = self.update(board.n, paused=time.time())
        self.record.emit("board", board.n, PAUSED, self.actor)
        return board

    @action
    def resume(self, n: int):
        board = self.load(n)
        if not board.paused:
            raise Refused(f"board {board.n} is not paused")
        board = self.update(board.n, paused=0.0)
        self.record.emit("board", board.n, RESUMED, self.actor)
        return board
