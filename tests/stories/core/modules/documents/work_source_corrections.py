from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.modules.documents.support.trail_fixtures import feature, pending, selected_trail as trail


@pending(6888)
def test_work_source_display_is_read_only(trail):
    first = trail.requested_command("message work-source --json")
    second = trail.requested_command("message work-source --json")
    feature(first.output_text == second.output_text, "reading source changes its version or origin")
    trail.make_task()
    trail.expect_link("message:2", "task:2", "about")


@pending(6888)
def test_source_changes_are_observable(trail):
    first = trail.requested_command("message work-from 2")
    second = trail.requested_command("message work-from 1")
    feature("2" in first.output_text and "1" in second.output_text, "selection did not name its new source")
    cleared = trail.requested_command("message clear-work-source")
    feature("clear" in cleared.output_text.lower() or "none" in cleared.output_text.lower(), cleared.output_text)


@pending(6888)
def test_authorized_link_correction_keeps_other_relations(trail):
    trail.command('task edit 1 --brief "message 2"')
    trail.expect_link("message:2", "task:1", "edited")
    edge = next(row for row in trail.links("message:2") if row["link_type"] == "edited")
    trail.requested_command(f'link remove {edge["id"]}')
    trail.expect_link("message:2", "task:1", "about")
    trail.expect_link("task:1", "message:2", "mentions")


@pending(6888)
def test_link_removal_does_not_reappear_on_retry(trail):
    trail.make_task()
    trail.expect_link("message:2", "task:2", "about")
    edge = next(row for row in trail.links("message:2") if row["target_model"] == "task" and row["target_id"] == 2)
    trail.requested_command(f'link remove {edge["id"]}')
    trail.requested_command(f'link remove {edge["id"]}')
    trail.command('task edit 2 --brief "A repeated automatic attribution attempt"')
    trail.story.run_listeners()
    feature(not any(row["target_model"] == "task" and row["target_id"] == 2 and row["link_type"] == "about" for row in trail.links("message:2")), "a corrected automatic identity reappeared")
    trail.switch(2)
    trail.command('task edit 2 --brief "Explicit attribution after correction"')
    trail.expect_link("message:2", "task:2", "about")


@pending(6888)
def test_unauthorized_link_correction_changes_nothing(trail):
    edge = next(row for row in trail.links("message:2") if row["link_type"] == "comments_on")
    helper_id = trail.story.new_row_id(f"agent start correction-helper claude helper --parent {trail.story.agent.id} --environment main")
    result = trail.story.run(f'link remove {edge["id"]}', actor=Actor(helper_id, ActorType.AGENT))
    feature(result.code == 1, result.output_text)
    trail.expect_link("message:2", "message:1", "comments_on")
