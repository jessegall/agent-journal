import time

from controllers.types import Messages, Questions
from features.boards.resource import DRAFTING_PHASE, EXPLORING, LOST, PANEL_REPLY, STALLED, WAITING
from resources.base import COMMISSIONED, REQUESTED, REVISED, Ref, Refused, SYSTEM, titled
from controllers.marks import action

READING = 120
FEWEST = 6
START_OVER = "Start over"
CANCEL_HOLDS = 600
SECTION_STATES = ("now", "read", "out", "asked")
IDEAS, IDEA = 5, 60
KNOWS_AT, READY_AT, MOST_TURNS = 4, 5, 5


def numbers_in(text: str) -> list[int]:
    return [int(t.lstrip("#")) for t in str(text).replace(",", " ").split() if t.lstrip("#").isdigit()]


class DraftingBoards:
    @action
    def ask(self, n: int, question: str, abstract: str = "", **data):
        board = self.load(n)
        asking = Questions(self.record, actor=self.actor, session=self.session, agent=self.agent)
        return asking.create(question, abstract, about=board.ref, hidden=True, **data)

    @action
    def cancel(self, n: int):
        board = self.load(n)
        asking = Questions(self.record, actor=self.actor, session=self.session, agent=self.agent)
        for open_question in asking.about(board.ref):
            if not open_question.completed:
                asking.complete(open_question.n, how=START_OVER, reason="The request on the board was cancelled")
        self._stop_drafting(board)
        return self.update(board.n, drafting={"cancelled": time.time()} if board.drafting_since else {})

    def cancelled_lately(self, n: int) -> bool:
        return time.time() - self.load(n).drafting.get("cancelled", 0) < CANCEL_HOLDS

    def _stop_drafting(self, board) -> None:
        from features.sequences.controller import Sequences
        sequences = Sequences(self.record, actor=self.actor, session=self.session, agent=self.agent)
        for about in board.asked:
            sequences.give_up(about, why="The request on the board was cancelled")
        tickets = self._cards(self.actor)
        for left in self._drafts(board) if board.drafting_since else []:
            tickets.delete(left.n, why="The request on the board was cancelled")

    @action
    def request(self, n: int, text: str, idempotency: str = ""):
        return self._opened(self.load(n), REQUESTED, text, idempotency)

    @action
    def hand(self, n: int, document: str, text: str = "", idempotency: str = ""):
        board = self.load(n)
        if document not in board.files:
            raise Refused(f"board {board.n} holds no file {document!r}; attach it first")
        return self._opened(board, COMMISSIONED, text.strip() or f"Draft tickets from {document}", idempotency, document=document)

    @action
    def outline(self, n: int, sections: str):
        board = self._drafting(n)
        titles = [title.strip() for title in sections.split("|") if title.strip()]
        if not titles:
            raise Refused("name the document's sections in order, split by |, like Background|Who can invite|Roles")
        return self._merged(board, "drafting", outline=[{"title": title, "state": "", "drafts": 0} for title in titles])

    @action
    def progress(self, n: int, section: str, state: str, drafts: str = ""):
        board = self._drafting(n)
        if state not in SECTION_STATES:
            raise Refused(f"a section is marked {', '.join(SECTION_STATES)}; not {state!r}")
        outline = board.drafting.get("outline") or []
        if section not in [part["title"] for part in outline]:
            raise Refused(f"the outline has no section {section!r}; it has {', '.join(part['title'] for part in outline)}")
        marked = [{**part, "state": state, "drafts": int(drafts or part["drafts"])} if part["title"] == section else part for part in outline]
        return self._merged(board, "drafting", outline=marked)

    @action
    def group(self, n: int, name: str, tickets: str):
        board = self.load(n)
        if not board.drafting_since:
            return board
        groups = {**(board.drafting.get("groups") or {}), name.strip(): self._drafted(board, tickets)}
        return self._merged(board, "drafting", groups=groups)

    @action
    def pick(self, n: int, tickets: str):
        board = self._drafting(n)
        return self._merged(board, "drafting", picks={"tickets": self._drafted(board, tickets), "at": time.time()})

    def _drafted(self, board, tickets: str) -> list[int]:
        numbers = numbers_in(tickets)
        drafts = {t.n for t in self._cards(self.actor)._standing() if t.draft and int(t.board) == board.n}
        stray = [n for n in numbers if n not in drafts]
        if not numbers or stray:
            raise Refused(f"name drafts on board {board.n}, like \"12, 13\"; not {stray or tickets!r}")
        return numbers

    @action
    def say(self, n: int, line: str):
        board = self._drafting(n)
        asked = board.asked
        if not asked:
            raise Refused(f"nothing was asked on board {board.n} to answer")
        drafted = len(self._drafts(board))
        if board.phase == DRAFTING_PHASE and drafted < board.expected:
            raise Refused(f"you guessed {board.expected} cards and drafted {drafted}: draft the rest before you say you are done")
        return Messages(self.record, actor=self.actor, session=self.session, agent=self.agent).comment(Ref.parse(asked[-1]).n, line.strip())

    def _drafts(self, board) -> list:
        since = board.drafting_since
        return [t for t in self._cards(SYSTEM)._standing() if t.draft and int(t.board) == board.n and t.created >= since]

    def _drafting(self, n: int):
        board = self.load(n)
        if not board.drafting_since:
            raise Refused(f"nothing is being drafted on board {board.n}")
        return board

    def _opened(self, board, moment: str, text: str, idempotency: str, **data):
        self.cancel(board.n)
        made = self._filed(board, text, idempotency, **data)
        self.update(board.n, expected=0, drafting={"since": made.created, "idempotency": made.idempotency, "asked": [made.ref],
                                                  "phase": EXPLORING, "score": 0, "turns": 0})
        self.record.emit("message", made.n, moment, self.actor)
        return made

    @action
    def score(self, n: int, score: str, reading: str = "", goal: str = "", done: str = ""):
        from features.sequences.controller import Sequences
        from features.boards.drafting import DRAFTING
        from features.boards.exploration import EXPLORATION
        board = self._drafting(n)
        if not str(score).isdigit() or not 1 <= int(score) <= 5:
            raise Refused(f"the score is how well you understand what they want, a whole number from 1 to 5; not {score!r}")
        if board.phase != EXPLORING:
            raise Refused(f"board {board.n} is past exploring: the request is {board.phase}")
        about, turns, rated = board.asked[0], int(board.drafting.get("turns", 0)) + 1, int(score)
        sequences = Sequences(self.record, actor=self.actor, session=self.session, agent=self.agent)
        exploring = sequences._titled(EXPLORATION.title)
        handed = 0
        if rated >= READY_AT or (rated >= KNOWS_AT and turns >= MOST_TURNS):
            sequences.finish(exploring.n, about)
            handed = sequences.run(sequences._titled(DRAFTING.title).n, about=about).n
            phase = DRAFTING_PHASE
        elif turns >= MOST_TURNS:
            sequences.finish(exploring.n, about)
            phase, rated = LOST, 0
        else:
            sequences.jump(exploring.n, about, rated + 1)
            handed, phase = exploring.n, EXPLORING
        read = reading.strip()[:READING] or board.drafting.get("reading", "")
        board = self._goal_set(board, goal, done)
        board = self._merged(board, "drafting", phase=phase, score=rated, turns=turns, reading=read)
        return sequences.follow(handed, about=about) if handed else board

    @action
    def ideas(self, n: int, ideas: list[str]):
        kept = [" ".join(str(idea).split()) for idea in ideas if str(idea).strip()]
        if not 2 <= len(kept) <= IDEAS:
            raise Refused(f"write 2 to {IDEAS} short ideas, each one thing the user might ask for on this board")
        if any(len(idea) > IDEA for idea in kept):
            raise Refused(f"each idea fits one chip: at most {IDEA} characters")
        return self.update(int(n), ideas=kept, ideas_at=time.time())

    @action
    def wait(self, n: int):
        board = self._drafting(n)
        if board.phase != DRAFTING_PHASE:
            raise Refused(f"board {board.n} is not drafting, so there is nothing to wait for: it is {board.phase}")
        return self._merged(board, "drafting", phase=WAITING)

    @action
    def stall(self, n: int, why: str):
        board = self._drafting(n)
        if not why.strip():
            raise Refused("say why filling the board cannot go on: journal board stall <n> \"<why>\"")
        return self._merged(board, "drafting", phase=STALLED, stalled=why.strip(),
                                              stalled_from=board.drafting.get("stalled_from") or board.phase)

    @action
    def retry(self, n: int):
        board = self._drafting(n)
        if board.phase != STALLED:
            raise Refused(f"board {board.n} is not stalled: nothing to retry")
        from features.sequences.controller import Sequences
        from features.sequences.resource import RunKey
        asked = board.asked
        sequences = Sequences(self.record, actor=SYSTEM)
        for row in sequences.open_rows():
            sequence = sequences.load(row["n"])
            if not sequence.dispatch:
                continue
            for key, run in sequence.runs.items():
                if RunKey.of(key).about not in asked:
                    continue
                handed = {k: v for k, v in run.items() if k != "agent"}
                sequences.update_run(sequence, key, {**handed, "retried": time.time()})
        restored = {k: v for k, v in board.drafting.items() if k not in ("stalled", "stalled_from")}
        return self.update(board.n, drafting={**restored, "phase": board.drafting.get("stalled_from") or EXPLORING})

    def _goal_set(self, board, goal: str, done: str):
        clauses = [clause.strip() for clause in done.split("|") if clause.strip()]
        if not goal.strip() and not clauses:
            return board
        kept = list(board.done_when) if board.started else []
        return self.update(board.n, goal=goal.strip() or board.goal, done_when=kept + [c for c in clauses if c not in kept])

    @action
    def expect(self, n: int, count: str, fewer: str = ""):
        if not str(count).isdigit():
            raise Refused(f"the count is how many tickets you will draft, a whole number like 3; not {count!r}")
        if int(count) < FEWEST and not fewer.strip():
            raise Refused(f"a board is filled with at least {FEWEST} cards, preferably 8; for fewer, say why with --fewer \"<why>\"")
        board = self.load(n)
        shown = board.expected
        if int(count) < shown and board.phase == DRAFTING_PHASE:
            raise Refused(f"{shown} placeholders already show; the count only grows, so draft them or leave it at {shown}")
        return self.update(int(n), expected=int(count))

    @action
    def revise(self, n: int, text: str, idempotency: str = ""):
        board = self.load(n)
        made = self.follow_up(board.n, text, idempotency)
        self.record.emit("message", made.n, REVISED, self.actor)
        return made

    @action
    def follow_up(self, n: int, text: str, idempotency: str = ""):
        board = self.load(n)
        made = self._filed(board, text, idempotency)
        if board.drafting_since:
            was = board.phase
            self._merged(board, "drafting", asked=[*board.asked, made.ref], phase=DRAFTING_PHASE if was == WAITING else was)
        return made

    def _filed(self, board, text: str, idempotency: str, **data):
        return Messages(self.record, actor=self.actor, session=self.session, agent=self.agent).create(
            titled(text), brief=text.strip(), about=board.ref, window=board.ref, new_work=True, idempotency=idempotency,
            reply_with=f'journal board say {board.n} "<one line, at most {PANEL_REPLY} characters>"', **data)
