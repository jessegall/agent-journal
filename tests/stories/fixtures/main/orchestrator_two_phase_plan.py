from journal.features.workers.states.orchestrating import Orchestrating
from journal.features.workers.workers_options import ORCHESTRATOR_MODE, WorkersOptions
from journal.models.plan_state import PlanState
from tests.stories.fixtures.main.manual_draft_plan import ManualDraftPlan
from tests.stories.fixtures.state_fixture import StateFixture


class OrchestratorTwoPhasePlan(StateFixture):
    """In orchestrator mode, the agent built the drafted plan into two phases with one briefed task each and the user approved it in the viewer; the project is a git repository: story.plans.first, story.tasks.first_phase and story.tasks.second_phase."""

    stack = (Orchestrating,)

    parent = ManualDraftPlan

    settings = ((WorkersOptions.MODE, ORCHESTRATOR_MODE),)

    def steps(self, story) -> None:
        story.project_is_a_git_repository()
        story.agent_runs(story.agents.main, f"plan phase {self.plans.first} 'Layout' --when 'the layout stands'")
        story.agent_runs(story.agents.main, f"plan phase {self.plans.first} 'Content' --when 'the pages hold their words'")
        self.tasks.first_phase = story.agent_adds_plan_task(story.agents.main, self.plans.first, "the grid")
        self.tasks.second_phase = story.agent_adds_plan_task(story.agents.main, self.plans.first, "the about page")
        story.agent_runs(story.agents.main, f"plan todos {self.plans.first} 1 {self.tasks.first_phase}")
        story.agent_runs(story.agents.main, f"plan todos {self.plans.first} 2 {self.tasks.second_phase}")
        story.agent_runs(story.agents.main, f"plan ready {self.plans.first}")
        story.user_approves_plan(self.plans.first)

    def expected(self, story) -> None:
        story.expect_plan(self.plans.first, state=PlanState.APPROVED)
        story.expect_stack(story.agents.main, Orchestrating)
