import fcntl
import os
import pty
import signal
import struct
import subprocess
import termios
import threading
from pathlib import Path

from core.base.journal_home import JournalHome
from tests.stories.server.support.go_build import GoBuild

ROOT = Path(__file__).resolve().parents[4]
SCREEN_WAIT_SECONDS = 30
END_WAIT_SECONDS = 15
READ_BYTES = 4096
WINDOW_SIZE = struct.pack("HHHH", 40, 120, 0, 0)
ENTER = b"\r"
PROGRAM_LINE = "the stand-in program runs"
FAKE_PROGRAM = f'#!/bin/sh\necho "{PROGRAM_LINE}"\nexec python3 -c "import signal; signal.pause()"\n'
EMPTY_OPEN = "#!/bin/sh\nexit 0\n"
SUITE_QUESTION = "Which suite?"
ENVIRONMENT_QUESTION = "Which environment?"
RUNNING_QUESTION = "A main agent is running in this environment"
CONVERSATION_QUESTION = "Which conversation?"
PROMPT_QUESTION = "Permission prompts?"


def fake_programs(folder: Path) -> Path:
    """A folder for the path of a launch: a program in place of Claude Code that only runs, and openers that open no browser."""
    folder.mkdir()
    for name, text in (("claude", FAKE_PROGRAM), ("open", EMPTY_OPEN), ("xdg-open", EMPTY_OPEN)):
        program = folder / name
        program.write_text(text)
        program.chmod(0o755)
    return folder


class LaunchTerminal:
    """`journal launch claude` through the real client in a pseudo terminal of its own: it reads what the
    launch draws, jumps to the suite by its number and presses Enter on each question, as a person takes the
    defaults. Whatever still runs is killed when the story ends."""

    def __init__(self, home: JournalHome, binary: Path, programs: Path, folder: Path, suite_number: int) -> None:
        self.screen, self.read_up_to, self.suite_number = bytearray(), 0, suite_number
        self.screen_changed = threading.Condition()
        self.controller, terminal = pty.openpty()
        fcntl.ioctl(terminal, termios.TIOCSWINSZ, WINDOW_SIZE)
        environment = GoBuild.environment(JOURNAL_HOME=str(home.folder), JOURNAL_SOURCE=str(ROOT / "src"))
        environment["PATH"] = f"{programs}{os.pathsep}{environment['PATH']}"
        self.process = subprocess.Popen([str(GoBuild.built("journal", binary)), "launch", "claude"], stdin=terminal, stdout=terminal, stderr=terminal, cwd=folder, env=environment, start_new_session=True)
        os.close(terminal)
        threading.Thread(target=self.kept_screen, daemon=True).start()

    def __enter__(self) -> "LaunchTerminal":
        return self

    def __exit__(self, *details: object) -> None:
        if self.process.poll() is None:
            self.process.kill()
        self.process.wait()
        os.close(self.controller)

    def kept_screen(self) -> None:
        try:
            while text := os.read(self.controller, READ_BYTES):
                with self.screen_changed:
                    self.screen += text
                    self.screen_changed.notify_all()
        except OSError:
            return

    def wait_for(self, text: str) -> None:
        wanted = text.encode()
        with self.screen_changed:
            matched = self.screen_changed.wait_for(lambda: self.screen.find(wanted, self.read_up_to) >= 0, SCREEN_WAIT_SECONDS)
            if not matched:
                raise AssertionError(f"the launch never drew {text!r}, it drew: {bytes(self.screen[self.read_up_to:])!r}")
            self.read_up_to = self.screen.find(wanted, self.read_up_to) + len(wanted)

    def press_enter(self, question: str) -> None:
        self.wait_for(question)
        os.write(self.controller, ENTER)

    def pick_suite(self) -> None:
        self.wait_for(SUITE_QUESTION)
        os.write(self.controller, str(self.suite_number).encode() + ENTER)

    def last_question_wait(self) -> None:
        self.pick_suite()
        for question in (ENVIRONMENT_QUESTION, CONVERSATION_QUESTION):
            self.press_enter(question)
        self.wait_for(PROMPT_QUESTION)

    def expect_last_question_program(self) -> None:
        os.write(self.controller, ENTER)
        self.wait_for(PROGRAM_LINE)

    def expect_menu_program(self) -> None:
        self.last_question_wait()
        self.expect_last_question_program()

    def expect_stopping_running_main_program(self) -> None:
        self.pick_suite()
        for question in (ENVIRONMENT_QUESTION, RUNNING_QUESTION, CONVERSATION_QUESTION, PROMPT_QUESTION):
            self.press_enter(question)
        self.wait_for(PROGRAM_LINE)

    def expect_ended(self) -> None:
        try:
            self.process.wait(END_WAIT_SECONDS)
        except subprocess.TimeoutExpired as error:
            raise AssertionError(f"the launch still runs, it drew: {bytes(self.screen)!r}") from error

    def expect_running(self) -> None:
        assert self.process.poll() is None, bytes(self.screen)

    def kill_launcher(self) -> None:
        self.process.send_signal(signal.SIGKILL)
        self.process.wait()
