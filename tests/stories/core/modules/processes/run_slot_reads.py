from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.listener.rows.event_rows import EventRows
from core.modules.processes.commands.grant_run_slots.grant_run_slots import GrantRunSlots
from tests.stories.core.modules.processes.run_queue import has_slot, queued
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.modules.processes.support.queue_fixtures import QueueAgents
from tests.stories.support.statement_counts import reads_in_last_request

WAITING_RUNS = 12
PROCESS_READ = "SELECT * FROM processes WHERE id IN"
VERSION_READ = "SELECT id, version FROM processes"


def test_granting_slots_to_twelve_waiting_runs_reads_their_processes_once(new_story):
    story = install_runner(new_story(fixture=QueueAgents))
    story.home.restart_mark.write_text("1")
    waiting = [queued(story, f"make run-{number}") for number in range(WAITING_RUNS)]
    story.home.restart_mark.unlink()
    story.container.get(EventRows).known.clear()
    with story.repeated_work.request():
        story.container.get(Bus).run(GrantRunSlots(), Actor.core())
    reads, version_reads = reads_in_last_request(story, PROCESS_READ), reads_in_last_request(story, VERSION_READ)
    story.expect_rows([has_slot(story, process) for process in waiting].count(True) == 2, reads == 1, version_reads == 0,
                      detail=f"{reads} process reads, {version_reads} version reads")
