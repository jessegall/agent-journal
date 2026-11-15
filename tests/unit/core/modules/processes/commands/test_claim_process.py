from types import SimpleNamespace

import pytest

from engine.errors.refusal import Refusal
from core.modules.processes.commands.claim_process.claim_process import ClaimProcess
from core.modules.processes.commands.claim_process.claim_process_handler import ClaimProcessHandler

PREPARED = SimpleNamespace(id=7, claim_token="c0ffee", claimed_at=None, changed=lambda **fields: SimpleNamespace(id=7, **fields))


class Rows:
    def __init__(self, process):
        self.process, self.saved = process, []

    def query(self, model):
        return SimpleNamespace(find=lambda process_id: self.process)

    def save(self, process, context):
        self.saved.append(process)
        return process


def claimed(process, token: str = "c0ffee") -> Rows:
    rows = Rows(process)
    ClaimProcessHandler(rows, rows).handle(ClaimProcess(7, token), SimpleNamespace(timestamp="now"))
    return rows


def test_the_first_claim_with_the_runs_token_writes_when_it_was_claimed():
    assert claimed(PREPARED).saved[0].claimed_at == "now"


def test_a_second_claim_is_refused_so_the_line_starts_one_shell():
    with pytest.raises(Refusal, match="was started already"):
        claimed(SimpleNamespace(**{**vars(PREPARED), "claimed_at": "earlier"}))


def test_a_token_the_run_was_not_prepared_with_is_refused():
    with pytest.raises(Refusal, match="was not prepared with this token"):
        claimed(PREPARED, "tea")
