from datetime import timedelta

from suites.coding.modules.workers.rules.unmerged_worker_rule import UnmergedWorkerRule
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_the_unmerged_worker_rule_is_asked_on_every_tick_ungated_while_nothing_is_delivered(new_story, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    asked = []
    answer = UnmergedWorkerRule.answer

    def counted(rule, hook):
        asked.append(hook.hook_name)
        return answer(rule, hook)

    monkeypatch.setattr(UnmergedWorkerRule, "answer", counted)
    for _ in range(2):
        story.advance(timedelta(seconds=30))
        story.tick("s-1")
    story.expect_rows(len(asked) == 2, detail=str(asked))
