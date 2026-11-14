from pathlib import Path

from suites.coding.modules.workers.support.worker_command import WORK_STEPS
from suites.coding.support.profile_commands import WORKER_COMMANDS
from suites.coding.support.shipped_profiles import WORKER_RULES

SKILL = Path(__file__).resolve().parents[6] / "src/suites/coding/modules/workers/skills/journal-worker/SKILL.md"


def test_92_the_words_agree_with_the_behaviour():
    skill = SKILL.read_text()
    texts = (WORKER_RULES, WORKER_COMMANDS, WORK_STEPS)
    assert all(('journal worker ask-merge' in text for text in texts))
    assert not any(('journal worker deliver' in text for text in texts))
    assert not any(('is final' in text for text in texts))
    assert 'is final' not in skill
