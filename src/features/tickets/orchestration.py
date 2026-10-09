from features.boards.controller import Boards
from features.plans.controller import READY, WAITING
from features.sequences.resource import RunKey
from features.tickets.resource import PROPOSED
from resources.base import AGENT, SYSTEM

PLANS, WAITS, DRAFTS = "orchestrator_approves_plans", "orchestrator_accepts_waits", "orchestrator_confirms_drafts"
REVIEW_MOMENTS = ("ticket.plan_waits", "ticket.checkpoint", "ticket.finished")


class TicketOrchestration:
    def _refusal(self, ticket, permission: str, what: str) -> str:
        board = self._board(ticket)
        if not getattr(board, permission):
            return f"board {board.n} does not let its orchestrator {what}: journal board update {board.n} --set {permission}=true allows it, or the user does it in the viewer"
        return (f"{self.record.env} does not orchestrate board {board.n} ({board.orchestrator or 'no environment'} does): its orchestrator may {what}; "
                f"journal board update {board.n} --set orchestrator={self.record.env} makes this environment the orchestrator")

    def _orchestrating(self) -> list[int]:
        return sorted(board.n for board in Boards(self.record, actor=SYSTEM).rows.standing() if not board.finished and board.orchestrator == self.record.env)

    def _awaiting_orchestrator(self) -> list:
        boards = self._orchestrating()
        if not boards:
            return []
        return [ticket for ticket in self.rows.standing() if ticket.work_environment and ticket.board and int(ticket.board) in boards
                and self._orchestrator_may(ticket, PLANS) and self._plan_status(ticket) in (READY, WAITING)]

    def _orchestrator_may(self, ticket, permission: str) -> bool:
        board = self._board(ticket)
        return bool(board) and bool(getattr(board, permission))

    def _awaiting_decisions(self) -> list:
        boards = self._orchestrating()
        if not boards:
            return []
        on_board = [ticket for ticket in self.rows.standing() if ticket.board and int(ticket.board) in boards]
        return [(ticket, WAITS) for ticket in on_board if PROPOSED in ticket.dependencies.values() and self._orchestrator_may(ticket, WAITS)] + \
               [(ticket, DRAFTS) for ticket in on_board if ticket.draft and self._orchestrator_may(ticket, DRAFTS)]

    def _reviewing(self, ticket) -> str:
        from features.sequences.controller import Sequences
        return next((row["title"] for row in Sequences(self.record, actor=SYSTEM).open_rows() if row.get("starts_on") in REVIEW_MOMENTS
                     and any(RunKey.of(key).about == ticket.ref for key in row.get("runs") or {})), "")

    def _as_orchestrator(self, ticket, permission: str, what: str, done: str, why: str) -> None:
        if self.actor != AGENT:
            return
        if not (ticket.board and int(ticket.board) in self._orchestrating() and self._orchestrator_may(ticket, permission)):
            self._refuse(self._refusal(ticket, permission, what))
        if not why.strip():
            self._refuse("say why, as the board's orchestrator: --why \"<reason>\"")
        self.comment(ticket.n, f"{done} as the board's orchestrator: {why.strip()}")
