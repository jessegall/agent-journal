import socket
import threading

from engine.actor.actor import Actor
from engine.command.bus import Bus
from core.modules.agents.commands.bind_agent_session.bind_agent_session import BindAgentSession
from core.modules.agents.support.terminal_typing import TerminalTyping
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import AgentStarted, UserJoined
from tests.stories.core.support.agent_labels import agent_label

TERMINAL_LINES = "1\tready\n2\tReading cart.py\n3\tThe total is in cents now\n"


def test_an_agents_terminal_lines_are_read_from_the_launchers_log_and_after_a_line_only_the_newer_ones(new_story):
    story = new_story(fixture=AgentStarted)
    terminal_file = story.home.terminal_file(story.agent.id)
    terminal_file.parent.mkdir(parents=True)
    terminal_file.write_text(TERMINAL_LINES)
    story.expect_success(f"agent terminal {story.agent.id}", "1  ready", "2  Reading cart.py", "3  The total is in cents now")
    story.expect_success(f"agent terminal {story.agent.id} --after 2", "3  The total is in cents now")
    story.expect_absent(f"agent terminal {story.agent.id} --after 2", "1  ready", "2  Reading cart.py")


def test_a_menu_the_launcher_answered_shows_in_the_chat_with_what_it_pressed(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_text(f'agent menu-answer {story.agent.id} "Switch model?" "chose Yes"', "created: menu_answer:1")
    story.expect_text("chat-mark list --environment 1", "agents.menu", 'A menu in the agent\'s terminal was answered: "Switch model?" The journal chose Yes.')


class FakeTyping(TerminalTyping):
    """Keeps what would be typed, so a story reaches no launcher."""

    def __init__(self) -> None:
        self.typed: list[tuple[int, str]] = []

    def send_line(self, agent_id: int, line: str) -> None:
        self.typed.append((agent_id, line))


def test_a_person_types_a_line_in_a_running_agents_terminal(new_story):
    story = new_story(fixture=UserJoined)
    typing = FakeTyping()
    story.container.bind(TerminalTyping, typing)
    story.expect_success(f'agent type {story.agent.id} "ls -la"', f"typed in the terminal of {agent_label(story, story.agent.id)}", actor=story.user)
    story.expect_rows(typing.typed == [(story.agent.id, "ls -la")])


def test_an_empty_line_and_an_ended_agent_are_refused(new_story):
    story = new_story(fixture=UserJoined)
    typing = FakeTyping()
    story.container.bind(TerminalTyping, typing)
    story.expect_refusal(f'agent type {story.agent.id} " "', "give the line to type", actor=story.agent)
    story.expect_success(f"agent end {story.agent.id}", actor=story.user)
    story.expect_refusal(f'agent type {story.agent.id} "ls"', "has ended", actor=story.user)
    story.expect_rows(typing.typed == [])


def launcher_with_answer(story, answer: bytes) -> list[bytes]:
    received: list[bytes] = []
    listener = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    listener.bind(str(story.home.socket("launcher")))
    listener.listen(1)

    def serve() -> None:
        connection, _ = listener.accept()
        received.append(connection.recv(4096))
        connection.sendall(answer)
        connection.close()
        listener.close()

    threading.Thread(target=serve, daemon=True).start()
    return received


def test_the_launcher_gets_the_line_and_answers_that_it_typed_it(new_story):
    story = new_story(fixture=UserJoined)
    received = launcher_with_answer(story, b"typed\n")
    story.expect_success(f'agent type {story.agent.id} "ls"', actor=story.user)
    story.expect_rows(b'"typed": "ls"' in received[0], f'"agent_id": {story.agent.id}'.encode() in received[0])


def test_a_launcher_that_gives_no_answer_is_refused_with_what_to_do(new_story):
    story = new_story(fixture=UserJoined)
    launcher_with_answer(story, b"")
    story.expect_refusal(f'agent type {story.agent.id} "ls"', "the launcher did not type the line", actor=story.user)


def test_the_terminal_window_may_type(new_story):
    story = new_story(fixture=UserJoined)
    WindowStory(story).expect_window_allowed("coding.terminal", f'agent type {story.agent.id} "ls"')


def resumed_story(new_story):
    story = new_story(fixture=UserJoined)
    launch_id = story.new_row_id("agent start launch-one claude main --environment main")
    story.container.get(Bus).run(BindAgentSession(launch_id, "s-1"), Actor.core())
    return story, launch_id


def test_a_resumed_session_reads_and_types_in_the_terminal_of_the_launch_it_runs_in(new_story):
    story, launch_id = resumed_story(new_story)
    terminal_file = story.home.terminal_file(launch_id)
    terminal_file.parent.mkdir(parents=True)
    terminal_file.write_text("1\tready\n")
    typing = FakeTyping()
    story.container.bind(TerminalTyping, typing)
    story.expect_success(f"agent terminal {story.agent.id}", "1  ready")
    story.expect_success(f'agent type {story.agent.id} "ls"', actor=story.user)
    story.expect_rows(typing.typed == [(launch_id, "ls")])
