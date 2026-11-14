from engine.enums.command_category import CommandCategory
from engine.module.driver_entries import DRIVERS_MODULE
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from core.modules.drivers.models.hook_call import HookCall
from tests.stories.core.modules.drivers.support.priority_states import HoldModuleJoining, OrderModuleJoining, PATH, REFUSAL
from tests.stories.core.support.coding_fixtures import BuilderStartedWithoutPlainWords

LISTING = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))


def asked_rules(story, reply) -> list[str]:
    rows = story.container.get(Queries).query(HookCall).find(reply.hook_call_id).metadata.module_part(DRIVERS_MODULE)["rules"]
    return [row["rule"] for row in rows]


def test_critical_states_are_asked_in_registration_order_right_after_the_essential_rules_and_before_a_stack_state(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    story.expect_sync_success(f"{PATH}:OrderModuleJoining")
    order = asked_rules(story, story.hook("s-1", LISTING))
    story.expect_rows(order.index("acme.first-critical") + 1 == order.index("acme.second-critical"), order.index("acme.second-critical") < order.index("acme.stacked"),
                      order.index("acme.first-critical") <= 1 + order.index("drivers.managed-hooks"), detail=str(order))


def test_a_critical_refusal_ends_the_walk_so_no_state_after_it_is_asked(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    story.expect_sync_success(f"{PATH}:HoldModuleJoining")
    reply = story.hook("s-1", HookSamples.edit("src/cart.py"))
    order = asked_rules(story, reply)
    story.expect_rows(reply.refusal and REFUSAL.text in reply.refusal, "acme.holding" in order, "acme.after-hold" not in order, order[-1] == "acme.holding", detail=f"{reply.refusal} {order}")


def test_no_shipped_state_is_critical(new_story):
    story = new_story(fixture=BuilderStartedWithoutPlainWords)
    story.expect_no_text("driver state-types", "critical", actor=story.agent)
