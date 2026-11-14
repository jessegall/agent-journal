from engine.testing.stories.story import Story


def expect_started_task_count(story: Story, task_ids: tuple[int, ...], count: int) -> None:
    states = [story.run(f"task show {task_id}", actor=story.agent).output_text for task_id in task_ids]
    assert sum("state: started" in state for state in states) == count, states
