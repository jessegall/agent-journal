from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment


def test_the_board_reports_which_blocked_tasks_open_automatically(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success('actor make user "Ada"')
    story.expect_success('plan make "Plan" --environment main', actor=story.agent)
    story.expect_success('question ask "Which colour?" --context "Choose one" --options "Red" "Blue"', actor=story.agent)
    blocks = ['--reason "Needs attention"', '--until-user --reason "Needs a user"', '--on task:1',
              '--on question:1', '--on plan:1', f'--on worker:{agent_number(story, worker.id)}', "--until 'false'", '--until-user --reason "Needs a user" --on task:1']
    tasks = []
    for index, block in enumerate(blocks):
        task = story.new_row_id(f'task make "Wait {index}" --environment main', actor=story.agent)
        story.expect_success(f'task block {task} {block}', actor=story.agent)
        tasks.append(task)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, answer = window_data(server, cookie, keys="board", window="tasks.tasks")
        groups = answer["keys"]["board"]["value"]["groups"]
        rows = {row["id"]: row for group in groups for row in group["rows"]}
        story.expect_rows(status == 200, all(not rows[task]["automatic"] for task in (tasks[0], tasks[1], tasks[-1])),
                          all(rows[task]["automatic"] for task in tasks[2:-1]))
