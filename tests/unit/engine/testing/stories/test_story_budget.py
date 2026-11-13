from engine.testing.stories.story_budget import StoryBudget


def test_a_story_within_its_budget_has_no_overrun():
    assert StoryBudget().overrun(500) == ""


def test_a_story_over_its_points_names_its_cost_and_the_way_out():
    text = StoryBudget(points=1000).overrun(4200)
    assert "4200 database points, over its budget of 1000" in text
    assert "@pytest.mark.story_budget" in text
