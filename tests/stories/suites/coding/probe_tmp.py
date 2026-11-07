from tests.stories.core.support.coding_fixtures import BuilderWithUser


def test_probe(new_story):
    story = new_story(fixture=BuilderWithUser)
    ids = [story.new_row_id(f"agent start w{n}-session claude worker --parent {story.agent.id} --environment main") for n in range(2)]
    out = story.run("agent list --json", actor=story.user).output_text
    show = story.run(f"agent show {ids[0]}", actor=story.user).output_text
    assert False, (story.agent.id, story.user.id, ids, out[:1500], show)
