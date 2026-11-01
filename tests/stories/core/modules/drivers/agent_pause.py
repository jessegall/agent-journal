from core.base.driver.tool_type import ToolType
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.fixtures import UserJoined

WRITE_SAMPLE = HookSamples.sample("pre_tool_use", {"name": "Write", "category": ToolType.NEW_FILE, "files": ["a.py"], "shell": None, "diff": None})


class FakeTyping(TerminalTyping):
    """Keeps what would be typed, so a story reaches no launcher."""

    def __init__(self) -> None:
        self.typed: list[tuple[int, str]] = []

    def type_line(self, agent_id: int, line: str) -> None:
        self.typed.append((agent_id, line))


def test_a_paused_agents_tool_calls_are_refused_until_it_is_resumed(new_story):
    story = new_story(fixture=UserJoined)
    story.container.bind(TerminalTyping, FakeTyping())
    story.expect_success(f"agent pause {story.agent.id}", f"paused agent {story.agent.id}", actor=story.user)
    story.expect_hook_refusal("s-1", WRITE_SAMPLE, "the user paused you")
    story.expect_success(f"agent resume {story.agent.id}", f"resumed agent {story.agent.id}", actor=story.user)
    story.expect_hook_allowed("s-1", WRITE_SAMPLE)


def test_resume_types_that_it_may_carry_on(new_story):
    story = new_story(fixture=UserJoined)
    typing = FakeTyping()
    story.container.bind(TerminalTyping, typing)
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.expect_success(f"agent resume {story.agent.id}", actor=story.user)
    story.expect_rows(typing.typed == [(story.agent.id, "the user resumed you: carry on where you stopped")])


def test_with_no_terminal_the_resume_line_waits_for_the_next_hook(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.expect_success(f"agent resume {story.agent.id}", actor=story.user)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "the user resumed you", actor=story.user)


def test_only_a_person_pauses_or_resumes_and_the_state_must_fit(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal(f"agent pause {story.agent.id}", "only a person pauses", actor=story.agent)
    story.expect_refusal(f"agent resume {story.agent.id}", "only a person resumes", actor=story.agent)
    story.expect_refusal(f"agent resume {story.agent.id}", "is not paused", actor=story.user)
    story.expect_success(f"agent pause {story.agent.id}", actor=story.user)
    story.expect_refusal(f"agent pause {story.agent.id}", "is paused already", actor=story.user)
