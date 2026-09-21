import pytest

import features
from controllers.types import Works
from features.start.feature import COMPACTED
from engine.hooks import handle, start_file
from providers import PROVIDERS
from resources.base import AGENT
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_a_compacted_start_hands_the_recovery_steps_before_the_same_block():
    record = fresh()
    Works(record, actor=AGENT).create("the header")
    plain = start_file(record.root, record.env).read_text()
    compacted = start_file(record.root, record.env, compacted=True).read_text()
    assert compacted == COMPACTED + plain, "every write also rewrites the compacted block, the recovery steps before the same block"
    assert all(w in COMPACTED for w in ("conversation --back=1", "journal user", "journal open", "journal search", "Skill: journal")) is True, \
        "the steps name the reads that recover what the summary dropped"

    provider = PROVIDERS["claude"]()

    def start(source):
        return handle(provider, record.root, record.env, {"hook_event_name": "SessionStart", "session_id": "s-1", "source": source})["hookSpecificOutput"]["additionalContext"]

    assert start("startup") == plain, "a fresh start is handed the plain block"
    assert start("compact") == compacted, "a start after a compaction is handed the recovery steps first"
    assert start("resume") == plain, "a resume is a fresh start"
