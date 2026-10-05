from features.boards.controller import Boards
from features.plans.controller import READY, WAITING
from features.sequences.resource import RunKey
from features.tickets.resource import PROPOSED
from resources.base import AGENT, SYSTEM

PLANS, WAITS, DRAFTS = "orchestrator_approves_plans", "orchestrator_accepts_waits", "orchestrator_confirms_drafts"
REVIEW_MOMENTS = ("ticket.plan_waits", "ticket.checkpoint", "ticket.finished")


class TicketOrchestration:
    def _why_not(self, ticket) -> str:
        board = self._board(ticket)
        return "; ".join([
            f"board {board.n} has {PLANS} {'set' if board.data.get(PLANS) else 'unset'}",
            f"{self.record.env} {'orchestrates' if board.n in self._orchestrating() else 'does not orchestrate'} board {board.n}"
            + ("" if board.n in self._orchestrating() else f" (Play marks the environment that runs it; journal board update {board.n} --set orchestrator={self.record.env} takes it)"),
        ])

    def _orchestrating(self) -> list[int]:
        from features.boards.details import BoardsDetails
        from features.sequences.controller import Sequences
        if not BoardsDetails.values(self.record).orchestrating:
            return []
        from features.boards.orchestrating import ORCHESTRATION
        sequence = Sequences(self.record, actor=SYSTEM).rows.by_title(ORCHESTRATION.title)
        keys = [RunKey.of(key) for key in (sequence.runs if sequence else {})]
        running = {int(key.about.split(":")[1]) for key in keys if key.here(self.record.env) and key.about.startswith("board:")}
        held = {board.n for board in Boards(self.record, actor=SYSTEM).rows.standing()
                if not board.finished and board.orchestrator == self.record.env}
        return sorted(running | held)

    def _awaiting_orchestrator(self) -> list:
        boards = self._orchestrating()
        return [ticket for ticket in self.rows.standing() if ticket.work_environment and ticket.board and int(ticket.board) in boards
                and self._orchestrator_may(ticket, PLANS) and self._plan_status(ticket) in (READY, WAITING)]

    def _orchestrator_may(self, ticket, permission: str) -> bool:
        board = self._board(ticket)
        return bool(board) and bool(getattr(board, permission))

    def _awaiting_decisions(self) -> list:
        boards = self._orchestrating()
        on_board = [ticket for ticket in self.rows.standing() if ticket.board and int(ticket.board) in boards]
        return [(ticket, WAITS) for ticket in on_board if PROPOSED in ticket.dependencies.values() and self._orchestrator_may(ticket, WAITS)] + \
               [(ticket, DRAFTS) for ticket in on_board if ticket.draft and self._orchestrator_may(ticket, DRAFTS)]

    def _reviewing(self, ticket) -> str:
        from features.sequences.controller import Sequences
        return next((row["title"] for row in Sequences(self.record, actor=SYSTEM).open_rows() if row.get("starts_on") in REVIEW_MOMENTS
                     and any(RunKey.of(key).about == ticket.ref for key in row.get("runs") or {})), "")

    def _as_orchestrator(self, ticket, permission: str, gate: str, done: str, why: str) -> None:
        if self.actor != AGENT:
            return
        if not (ticket.board and int(ticket.board) in self._orchestrating() and self._orchestrator_may(ticket, permission)):
            self._refuse(f"only the user {gate}, or the agent orchestrating its board when the board has {permission} set")
        if not why.strip():
            self._refuse("say why, as the board's orchestrator: --why \"<reason>\"")
        self.comment(ticket.n, f"{done} as the board's orchestrator: {why.strip()}")
