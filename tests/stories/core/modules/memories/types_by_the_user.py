from tests.stories.core.support.fixtures import UserJoined

TYPE_COMMAND = 'memory-type make decision journal.core.memories "a choice made and why" --agent-writable --fades'


def test_an_agent_that_makes_a_memory_type_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal(TYPE_COMMAND, "only the user changes memory types", actor=story.agent)


def test_an_agent_that_switches_a_type_off_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal("memory-type-switch make fact coding journal.core.memories", "only the user changes memory types", actor=story.agent)


def test_the_user_makes_a_memory_type(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(TYPE_COMMAND, "name: decision", actor=story.user)
