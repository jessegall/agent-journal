from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class PrepareWorktree(Command[None]):
    """Gives a launch worktree the library folders of the project's folder and runs the worktree commands of
    the environment named in it, with the links and copies the order adds to the environment's own. A profile names the one whose instruction files
    the worktree gets."""

    lock = False

    folder: str
    source: str
    environment: str
    library_links: tuple[str, ...] = ()
    library_copies: tuple[str, ...] = ()
    profile: str = ""
