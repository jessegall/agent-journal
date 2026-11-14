import pytest

from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.end_process_part.end_process_part import EndProcessPart
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.support.output_folder import OutputFolder
from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.database.database import Database
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.query.queries import Queries
from tests.integration.support.acted_journal import ActedJournal
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run, start_process

READS_BESIDE_THE_PRUNING = 1


# two ended runs are kept beside the running commands
@pytest.fixture
def process_log(journal) -> ActedJournal:
    acted = ActedJournal.started(journal)
    assert acted.run(f"setting set {ProcessSetting.PROCESSES_KEPT.key} 2 --environment main", acted.user).code == 0
    return acted


def test_old_processes_parts_outputs_and_folders_are_removed_together(process_log):
    first = ended_run(process_log, "make first", "first\n")
    second = ended_run(process_log, "make second", "second\n")
    third = ended_run(process_log, "make third", "third\n")
    process_log.run_listeners()
    queries = process_log.container.get(Queries)
    assert not queries.query(Process).filter(id=first.id).exists()
    assert not queries.query(ProcessPart).filter(process_id=first.id).exists()
    assert not queries.query(Output).filter(process_id=first.id).exists()
    assert process_log.container.get(OutputFolder).process_ids() == [second.id, third.id]


def test_running_processes_remain_beside_the_newest_ended_runs(process_log):
    running = start_process(process_log, "make active", category=CommandCategory.BUILD)
    for number in range(4):
        ended_run(process_log, f"make finished-{number}", "done\n")
    queries = process_log.container.get(Queries)
    assert queries.query(Process).count() == 3 and queries.query(Process).find(running.id).ended_at is None
    assert queries.query(Output).filter(process_id=running.id).exists() and running.id in process_log.container.get(OutputFolder).process_ids()
    refused = process_log.run(f"process delete {running.id}", process_log.agent)
    assert refused.code != 0 and "running" in refused.text, refused


def test_a_long_run_is_kept_when_it_finishes_after_newer_short_runs(process_log):
    long_run = start_process(process_log, "make everything", category=CommandCategory.BUILD)
    first = ended_run(process_log, "make first", "first\n")
    ended_run(process_log, "make second", "second\n")
    end_run(process_log, long_run, "complete\n")
    queries = process_log.container.get(Queries)
    assert queries.query(Process).filter(id=long_run.id).exists() and not queries.query(Process).filter(id=first.id).exists()


def test_short_output_is_kept_with_its_process(process_log):
    process = start_process(process_log, "ls cart", category=CommandCategory.READ)
    process_log.container.get(OutputFolder).write_output(process.id, 1, "cart\n")
    bus = process_log.container.get(Bus)
    bus.run(EndProcessPart(process.id, 1, 0), process_log.agent, environment_id=1)
    bus.run(EndProcess(process.id, 0, 5, 1), process_log.agent, environment_id=1)
    assert process_log.container.get(Queries).query(Output).filter(process_id=process.id).exists()
    assert "cart" in process_log.run(f"output peek {process.id} --all", process_log.user).text


def test_deleting_an_ended_process_also_removes_its_folder(process_log):
    process = ended_run(process_log, "make package", "built\n")
    assert process_log.run(f"process delete {process.id}", process_log.agent).code == 0
    assert process.id not in process_log.container.get(OutputFolder).process_ids()


def test_each_environment_keeps_its_own_process_count(process_log):
    ended_run(process_log, "make main-first", "first\n")
    ended_run(process_log, "make main-second", "second\n")
    assert process_log.run("environment make web /work/web", process_log.user).code == 0
    assert process_log.run(f"setting set {ProcessSetting.PROCESSES_KEPT.key} 1 --environment web", process_log.user).code == 0
    web = Actor(process_log.new_row_id("agent start web-main claude main --environment web"), ActorType.AGENT)
    bus = process_log.container.get(Bus)
    for number in range(2):
        process = bus.run(StartProcess.single_part(web.id, f"make web-{number}", "/work/web", CommandCategory.BUILD, 30), web, environment_id=2)
        end_run(process_log, process, "web\n")
    queries = process_log.container.get(Queries)
    assert queries.query(Process).filter(environment_id=1).count() == 2 and queries.query(Process).filter(environment_id=2).count() == 1


def test_pruning_twenty_ended_runs_at_once_reads_each_table_that_names_them_once_for_all_of_them(journal):
    acted = ActedJournal.started(journal)
    for number in range(22):
        ended_run(acted, f"make step-{number}", "done\n")
        acted.run_listeners()
    assert acted.run(f"setting set {ProcessSetting.PROCESSES_KEPT.key} 2 --environment main", acted.user).code == 0
    connection = acted.container.get(Database).connection
    statements: list[str] = []
    connection.set_trace_callback(statements.append)
    ended_run(acted, "make last", "done\n")
    connection.set_trace_callback(None)
    tables = ("worker_operations", "merger_lines", "worker_worktrees", "trigger_action_runs", "reader_requests")
    reads = {table: sum(1 for statement in statements if statement.lstrip().upper().startswith("SELECT") and f"FROM {table} " in statement) for table in tables}
    assert acted.container.get(Queries).query(Process).count() == 2 and all(count <= READS_BESIDE_THE_PRUNING + 1 for count in reads.values()), reads
