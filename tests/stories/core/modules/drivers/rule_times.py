from engine.enums.command_category import CommandCategory
from engine.driver import driver_rules
from engine.module.driver_entries import DRIVERS_MODULE
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from core.modules.drivers.models.hook_call import HookCall
from core.modules.processes.rules.runner_rewrite_rule import RunnerRewriteRule
from tests.stories.core.support.coding_fixtures import BuilderStarted

STALL_SECONDS = 0.15
LISTING = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))


def test_a_hook_call_names_the_rule_that_stalled_with_its_milliseconds(new_story, monkeypatch):
    story = new_story(fixture=BuilderStarted)
    original = RunnerRewriteRule.answer
    clock = [0.0]

    def stalled(rule, hook):
        clock[0] += STALL_SECONDS
        return original(rule, hook)

    monkeypatch.setattr(driver_rules, "perf_counter", lambda: clock[0])
    monkeypatch.setattr(RunnerRewriteRule, "answer", stalled)
    reply = story.hook("s-1", LISTING)
    rules = story.container.get(Queries).query(HookCall).find(reply.hook_call_id).metadata.module_part(DRIVERS_MODULE)["rules"]
    named = [rule for rule in rules if rule["rule"] == RunnerRewriteRule.name]
    story.expect_rows(len(named) == 1, named[0].get("milliseconds", 0) >= STALL_SECONDS * 1000, detail=str(rules))
