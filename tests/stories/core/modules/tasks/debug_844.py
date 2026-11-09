from core.base.query.queries import Queries
from core.modules.drivers.models.rule_history import RuleHistory
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder


def test_debug(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.run('task make "The review" --environment main')
    story.run("wait on 'the review of the cart' --target tasks:2", actor=story.agent)
    reply = story.hook("s-1", HookSamples.stop())
    rows = [(row.rule, row.layer, str(row.last_due_outcome)) for row in story.container.get(Queries).query(RuleHistory).all_rows()]
    print("STOP", reply, rows)
    story.run("wait end 1", actor=story.agent)
    reply = story.hook("s-1", HookSamples.prompt("go on"))
    rows = [(row.rule, row.layer, str(row.last_due_outcome)) for row in story.container.get(Queries).query(RuleHistory).all_rows()]
    print("PROMPT", reply, rows)
    assert False
