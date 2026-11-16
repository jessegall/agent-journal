import pytest

from core.modules.claude_code.providers.claude_code_provider import COMPACT_LINE
from core.modules.drivers.models.enums.compaction_reason import CompactionReason
from core.modules.drivers.models.enums.compaction_state import CompactionState
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.drivers.context_compactions import compactions
from tests.stories.suites.coding.modules.workers.compaction_never_twice import compacted, expect_compaction_count, backdate_context
from tests.stories.suites.coding.modules.workers.context_limit import COMPACTION_START, LIMIT_TOKENS, SESSION, LimitEnabled, has_context, stops, typing_recorded

TERMINAL_COMPACTIONS = 10
CHANGED_LINE = "/compact keep the open tasks"


@pytest.fixture
def limited(played):
    return typing_recorded(played(LimitEnabled))








def test_j5_a_compaction_keeps_the_line_that_was_typed_when_the_program_line_changes_later(limited, monkeypatch):
    has_context(limited, LIMIT_TOKENS)
    stops(limited)
    monkeypatch.setattr("core.modules.claude_code.providers.claude_code_provider.COMPACT_LINE", CHANGED_LINE)
    limited.expect_rows([compaction.line for compaction in compactions(limited)] == [COMPACT_LINE], limited.typing.typed == [COMPACT_LINE], detail=str(compactions(limited)))
