"""What answers the Processes service: starting, telling and reading the agents this journal runs.

The controllers used to do this themselves, reaching up into the terminal and the providers from inside a
write. They ask here instead, by type, and this feature - which is the one that knows how an agent is
launched - is what answers.
"""

import subprocess
from collections import defaultdict
from pathlib import Path

from features.agent_sessions import launch
from resources.types import NewEnvironment, Running
from serving import SERVED, Processes

PS_TIMEOUT = 2


class TheProcesses:
    """The agents this journal starts, tells and reads: one object for every process a controller used to start itself."""

    def alive(self, pid) -> bool:
        """Whether the process is running."""
        from engine.sessions import alive
        return alive(pid)

    def leaves(self, pid: int) -> list[str]:
        """The commands still running at the ends of the process tree under pid, the newest last; none when the tree cannot be read."""
        if not pid:
            return []
        try:
            listed = subprocess.run(["ps", "-eo", "pid=,ppid=,command="], capture_output=True, text=True, timeout=PS_TIMEOUT).stdout
        except (OSError, subprocess.SubprocessError):
            return []
        below = defaultdict(list)
        for line in listed.splitlines():
            fields = line.split(None, 2)
            if len(fields) == 3 and fields[0].isdigit() and fields[1].isdigit():
                below[int(fields[1])].append((int(fields[0]), fields[2].strip()))
        leaves, waiting = [], [pid]
        while waiting:
            for child, command in below[waiting.pop()]:
                waiting.append(child)
                if not below[child]:
                    leaves.append(command)
        return leaves

    def environment(self, record, wanted: NewEnvironment):
        """The environment an agent is about to run in, made if it is not there and quietened."""
        return launch.prepared(record, wanted)

    def start(self, record, name: str, provider: str, args: list[str], cwd: Path) -> str:
        """Starts an agent in that environment, detached from this process."""
        return launch.launched(record, name, provider, args, cwd)

    def start_detached(self, root: Path, cwd: Path, environment: str, provider: str, args: list[str], conversation: str = "") -> int:
        from agents.terminal import detached
        return detached(root, cwd, environment, provider, args, conversation)

    def with_words(self, root: Path, environment: str, args: list[str], words: str) -> list[str]:
        """The command that starts an agent with those words already typed to it."""
        from agents.terminal import prompted
        return prompted(root, environment, args, words)

    def output(self, root: Path, environment: str) -> str:
        from agents.terminal import launch_output
        return launch_output(root, environment)

    def failure(self, root: Path, environment: str, lines: int = 3) -> str:
        from agents.terminal import launch_failure
        return launch_failure(root, environment, lines)

    def apart(self, command: list[str], cwd: Path) -> None:
        """Starts a command in a session of its own, with nothing attached to it: the journal asks for this rather than reaching for subprocess itself, so there is one place that says what a detached run looks like and one place a test can stand in for."""
        launch.apart(command, cwd)

    def apart_into(self, command: list[str], log: Path) -> int:
        """Starts a command in a session of its own writing into a log, and says which process it is."""
        return launch.apart_into(command, log)

    def running_in(self, record, environment: str) -> str:
        """The session of the agent running in that environment, empty where none does."""
        return launch.running_in(record, environment)

    def start_agent(self, record, name: str, worktree: str, abstract: str, owner: str, prompt: str, kind) -> str:
        """Makes the environment an agent is to work in and starts it there with those words, and says where it runs."""
        return launch.start_agent_in(record, name, worktree, abstract, owner, prompt, kind)

    def stop(self, record, environment: str) -> None:
        """Asks the agent running in that environment to end, when one does."""
        launch.stop_in(record, environment)

    def tell(self, running: Running, text: str) -> bool:
        """Types the words to the agent running there now, and says whether one was."""
        return launch.tell_in(running, text)

    def tell_behind(self, running: Running, text: str) -> bool:
        """The same, typed behind the answer, so the sender never waits on the other agent's screen."""
        return launch.tell_soon(running, text)


SERVED.answered(Processes, TheProcesses())
