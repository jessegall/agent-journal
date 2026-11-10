from datetime import datetime, timezone
from pathlib import Path
from types import SimpleNamespace

from suites.coding.modules.workers.commands.send_worker.send_worker_subcommand import SendWorkerSubcommand

ENDED_AT = datetime(2026, 11, 1, 9, 0, tzinfo=timezone.utc)
WORKER = SimpleNamespace(id=7, number=3, role="worker", program="codex", paused_at=None, ended_at=ENDED_AT, pid=None)
OUT = SimpleNamespace(is_ready=False, wait_line="out until 10:30, it hit a rate limit")
READY = SimpleNamespace(is_ready=True, wait_line="")


def answer(program_state: SimpleNamespace, tmp_path: Path) -> str:
    home = SimpleNamespace(socket=lambda name: tmp_path / name)
    resume = SimpleNamespace(program_state=lambda worker: program_state)
    subcommand = SendWorkerSubcommand(home, SimpleNamespace(), SimpleNamespace(), SimpleNamespace(), SimpleNamespace(), SimpleNamespace(), SimpleNamespace(), SimpleNamespace(), SimpleNamespace(), resume)
    return subcommand.answer(WORKER)


def test_the_answer_for_an_ended_worker_whose_program_is_out_names_the_program_it_waits_on(tmp_path):
    assert answer(OUT, tmp_path) == "worker 3 waits on codex: out until 10:30, it hit a rate limit; the job starts when it is back"


def test_the_answer_for_an_ended_worker_whose_program_is_ready_names_no_program(tmp_path):
    assert "waits on" not in answer(READY, tmp_path)
