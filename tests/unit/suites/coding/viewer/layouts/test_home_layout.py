from suites.coding.viewer.layouts.home_layout import HomeLayout
from suites.coding.viewer.presets.home.home_default_preset import HomeDefaultPreset


def test_the_right_pane_of_home_opens_on_the_agents_before_the_tasks_plans_questions_and_file_feed():
    for shape in (HomeLayout.shape, HomeDefaultPreset.shape):
        right = shape.second
        assert right.windows == ("agents.agents", "tasks.tasks", "plans.plans", "questions.questions", "coding.file-feed")
        assert right.active == "agents.agents"
