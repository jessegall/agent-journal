from core.base.registry.registry import Registry
from core.testing.expect_row import expect_row
from tests.stories.core.modules.plans.support.approval_fixtures import ReadyApprovalPlan


def test_approval_and_critique_have_separate_module_owners(new_story):
    story = new_story(fixture=ReadyApprovalPlan)
    buttons = {entry.declaration.name: entry for entry in story.container.get(Registry).buttons}
    expect_row(buttons["plans.approve"], module="journal.core.plans", shipped=True)
    expect_row(buttons["plan_reviews.critique"], module="journal.core.plan_reviews", shipped=True)
    approve = buttons["plans.approve"].declaration
    critique = buttons["plan_reviews.critique"].declaration
    expect_row(approve, label="Approve the plan", runs="plan approve {row_id}", icon="check", primary=True,
               tip="Approve the plan; the agent starts it", menu_label="Other ways to approve")
    expect_row(critique, label="Ask for a critique of the plan", tip="Reviewers read it before you approve")
    story.expect_rows(set(approve.slots) == {"row.plan"}, set(critique.slots) == {"row.plan"})


def test_template_choices_keep_every_agent_count_and_size(new_story):
    story = new_story(fixture=ReadyApprovalPlan)
    critique = next(entry.declaration for entry in story.container.get(Registry).buttons if entry.declaration.name == "plan_reviews.critique")
    agents, size, template = critique.fields
    story.expect_rows([choice.key for choice in agents.choices] == ["one agent", "2 agents", "3 agents", "4 agents", "5 agents"],
                      [choice.key for choice in size.choices] == ["a quick look", "a normal read", "a thorough review"])
    expect_row(template, default_title="General critique", target="plan", purpose="critique")


def test_the_critique_and_end_review_buttons_sit_on_the_plan_inspector_for_their_states(new_story):
    story = new_story(fixture=ReadyApprovalPlan)
    buttons = {entry.declaration.name: entry.declaration for entry in story.container.get(Registry).buttons}
    critique, end_review = buttons["plan_reviews.critique"], buttons["plan_reviews.end-review"]
    story.expect_rows(critique.slots == ("row.plan",), tuple(critique.condition.values) == ("ready",),
                      end_review.slots == ("row.plan",), tuple(end_review.condition.values) == ("reviewing",))
    story.expect_text("plan show 1", "state: ready")
