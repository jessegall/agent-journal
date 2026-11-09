from tests.stories.core.support.fixtures import DependencyChain


def test_scratch(new_story):
    story = new_story(fixture=DependencyChain)
    result = story.run("setting make journal.core.settings.guard.tasks.no-dependency-loop false")
    print("RESULT", result.exit_code if hasattr(result, "exit_code") else result, result.output_text)
    print(story.run("setting show journal.core.settings.guard.tasks.no-dependency-loop").output_text)
    assert False
