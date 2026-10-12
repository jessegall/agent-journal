"""What answers the Processes service: starting, telling and reading the agents this journal runs.

The controllers used to do this themselves, reaching up into the terminal and the providers from inside a
write. They ask here instead, by type, and this feature - which is the one that knows how an agent is
launched - is what answers.
"""

from pathlib import Path

from features.agent_sessions import launch
from resources.types import NewEnvironment, Running
from serving import SERVED, Processes


class TheProcesses:
    """The agents this journal starts, tells and reads: one object for every process a controller used to start itself."""

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

    def running_in(self, record, environment: str) -> str:
        """The session of the agent running in that environment, empty where none does."""
        return launch.running_in(record, environment)

    def tell(self, running: Running, text: str) -> bool:
        """Types the words to the agent running there now, and says whether one was."""
        return launch.tell_in(running, text)

    def tell_behind(self, running: Running, text: str) -> bool:
        """The same, typed behind the answer, so the sender never waits on the other agent's screen."""
        return launch.tell_soon(running, text)


SERVED.answered(Processes, TheProcesses())
