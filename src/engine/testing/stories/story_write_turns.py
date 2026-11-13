from datetime import timedelta
from threading import Event, Thread

from engine.database.database import Database
from engine.enums.execution_priority import ExecutionPriority
from engine.execution.current_execution import CurrentExecution
from engine.testing.stories.story import Story
from server.enums.queue_priority import QueuePriority
from server.execution.write_turn_queue import WriteTurnQueue

WAIT_LIMIT_SECONDS = 30.0
TURN_LIMIT_SECONDS = 3.0
WAITING_CHECKS = 100
WAITING_CHECK_SECONDS = 0.05
MAIN_AGENT_HOOK = "main agent hook"


class StoryWriteTurns(WriteTurnQueue):
    """The server's write turn queue on a story's journal and clock, bound to the story's database. It notes
    how many statements each turn it hands out had, the order waiting asks got the turn in, and the slow
    holders it logs."""

    def __init__(self, story: Story) -> None:
        self.slow_turns: list[str] = []
        super().__init__(story.clock, WAIT_LIMIT_SECONDS, self.slow_turns.append)
        self.story = story
        self.turn_statements: list[int] = []
        self.order: list[str] = []
        story.container.get(Database).turns = self

    def release(self) -> None:
        self.turn_statements.append(self.depth.statements)
        super().release()

    @property
    def is_free(self) -> bool:
        with self.changed:
            return self.holder is None and not self.waiting

    # Runs the line while another thread holds the turn, and says whether it answered before that thread gave it
    # back; a line that waited for the turn answers only once the holder gives up after its limit.
    def answers_beside_writer(self, line: str) -> bool:
        turn_started, finished = Event(), Event()
        holder = Thread(target=self.keep_turn, args=(turn_started, finished))
        holder.start()
        turn_started.wait(TURN_LIMIT_SECONDS)
        self.story.run(line)
        answered_first = holder.is_alive()
        finished.set()
        holder.join()
        return answered_first

    def keep_turn(self, turn_started: Event, finished: Event) -> None:
        with self.write_turn():
            turn_started.set()
            finished.wait(TURN_LIMIT_SECONDS)

    # Keeps the turn while the hooks of other agents and then the main agent's hook ask for it, and gives the order
    # they got it in.
    def hook_turn_order(self, agent_count: int) -> list[str]:
        asks = [(f"agent hook {number}", QueuePriority.AGENT_HOOK) for number in range(1, agent_count + 1)] + [(MAIN_AGENT_HOOK, QueuePriority.MAIN_AGENT_HOOK)]
        threads = [Thread(target=self.request_turn, args=(name, priority)) for name, priority in asks]
        with self.write_turn():
            for waiting_count, thread in enumerate(threads, start=1):
                thread.start()
                self.expect_waiters(waiting_count)
        for thread in threads:
            thread.join(WAIT_LIMIT_SECONDS)
        return self.order

    def request_turn(self, name: str, priority: QueuePriority) -> None:
        with CurrentExecution(priority.execution_priority, "hook", name).applied(), self.write_turn():
            self.order.append(name)

    def expect_waiters(self, count: int) -> None:
        with self.changed:
            for _ in range(WAITING_CHECKS):
                if len(self.waiting) >= count:
                    return
                self.changed.wait(WAITING_CHECK_SECONDS)

    def transaction_run(self, line: str) -> None:
        with self.story.container.get(Database).transaction():
            self.story.run(line)

    # Runs the line inside one turn held by a named class at agent priority while the story's clock moves on.
    def slow_turn_run(self, line: str, seconds: int) -> None:
        with CurrentExecution(ExecutionPriority.AGENT, "story", line).applied(), self.write_turn():
            self.story.run(line)
            self.story.advance(timedelta(seconds=seconds))
