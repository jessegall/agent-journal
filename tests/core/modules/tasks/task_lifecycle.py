from core.base.actor import Actor, ActorType


def started_story(new_story):
    story = new_story()
    story.run("environment make main /work/journal")
    story.agent = Actor(story.new_row_id("agent start s-1 claude main --environment main"), ActorType.AGENT)
    return story


def test_a_task_is_made_open_in_the_callers_environment(new_story):
    story = started_story(new_story)
    story.expect_success('task make "Fix the cart" --brief "the total is wrong" --environment main', "state: open", "environment_id: 1", "priority: normal")


def test_a_task_without_an_environment_is_refused_with_the_flag_to_name_one(new_story):
    story = started_story(new_story)
    story.expect_refusal('task make "Fix the cart"', "a task needs an environment: name it with --environment")


def test_a_task_moves_along_its_whole_lifecycle(new_story):
    story = started_story(new_story)
    story.run('task make "Fix the cart" --environment main')
    story.expect_success("task start 1", "state: started", f"holder_id: {story.agent.id}", actor=story.agent)
    story.expect_success('task pause 1 --reason "waiting on the design"', "state: paused", "reason: waiting on the design", actor=story.agent)
    story.expect_success("task resume 1", "state: started", actor=story.agent)
    story.expect_success("task test 1", "state: testing", actor=story.agent)
    story.expect_success('task close 1 --outcome "the total is right"', "state: completed", "closed_at: 2026-10-31T09:00:00.000000+00:00", actor=story.agent)
    story.expect_success("task reopen 1", "state: open", actor=story.agent)
    story.expect_success('task block 1 --reason "the API is down"', "state: blocked", actor=story.agent)
    story.expect_success("task unblock 1", "state: open", actor=story.agent)
    story.expect_success('task cancel 1 --reason "not needed"', "state: cancelled", actor=story.agent)


def test_closing_clears_the_holder(new_story):
    story = started_story(new_story)
    story.run('task make "Fix the cart" --environment main')
    story.run("task start 1", actor=story.agent)
    story.expect_absent('task close 1 --outcome "done"', f"holder_id: {story.agent.id}", actor=story.agent)


def test_a_move_out_of_a_wrong_state_is_refused_with_the_moves_that_go_on(new_story):
    story = started_story(new_story)
    story.run('task make "Fix the cart" --environment main')
    story.expect_refusal('task close 1 --outcome "done"', "from open it can only go on with journal task start 1")
    story.run('task cancel 1 --reason "not needed"')
    story.expect_refusal("task start 1", "from cancelled it can only go on with journal task reopen 1")


def test_a_title_over_eighty_characters_is_refused(new_story):
    story = started_story(new_story)
    story.expect_refusal(f'task make "{"x" * 81}" --environment main', "a task's title is 1 to 80 characters, not 81")


def test_a_priority_outside_its_list_is_a_usage_error(new_story):
    story = started_story(new_story)
    story.expect_usage_error('task make "Fix the cart" --priority urgent --environment main')


def test_an_environment_its_tasks_refer_to_cannot_be_deleted(new_story):
    story = started_story(new_story)
    story.run('task make "Fix the cart" --environment main')
    story.expect_refusal("environment delete 1", "this environment is still referred to by agents, messages, plans, settings, tasks")
