from tests.stories.core.modules.processes.queue_halt import halted_story
from tests.stories.core.modules.processes.run_queue import has_slot, queued
from tests.stories.support.statement_counts import reads_in_last_request

WAITING_RUNS = 12
PROCESS_READ = "SELECT * FROM processes WHERE id IN"


def test_granting_slots_to_twelve_waiting_runs_reads_their_processes_once(new_story):
    story = halted_story(new_story)
    waiting = [queued(story, f"make run-{number}") for number in range(WAITING_RUNS)]
    story.expect_success("queue resume", actor=story.agent)
    reads = reads_in_last_request(story, PROCESS_READ)
    story.expect_rows([has_slot(story, process) for process in waiting].count(True) == 2, reads == 1, detail=f"{reads} process reads")
