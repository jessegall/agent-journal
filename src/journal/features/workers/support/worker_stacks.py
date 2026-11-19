import subprocess
from pathlib import Path

PROJECT_LABEL = "com.docker.compose.project"
FOLDER_LABEL = "com.docker.compose.project.working_dir"
DOCKER_SECONDS = 20
DOWN_SECONDS = 120


class WorkerStacks:
    """The Docker Compose stacks a worker left running: those started from its worktree or below it, read from the labels
    Compose puts on their containers. A test stack nobody takes down keeps its memory, CPU and volumes long after its worker
    clocked out: on the hosted journal on 19 Nov 19 such stacks and 146 of their volumes held 21.5 GiB of memory and 28 GiB of
    disk. With no Docker to ask, a worker has none."""

    def running(self, folder: Path) -> list[str]:
        root = str(folder).rstrip("/")
        try:
            listed = subprocess.run(["docker", "ps", "--format", f'{{{{.Label "{PROJECT_LABEL}"}}}}\t{{{{.Label "{FOLDER_LABEL}"}}}}'],
                                    capture_output=True, text=True, timeout=DOCKER_SECONDS)
        except (OSError, subprocess.TimeoutExpired):
            return []
        if listed.returncode != 0:
            return []
        stacks = []
        for line in listed.stdout.splitlines():
            project, _, started_in = line.partition("\t")
            started_in = started_in.rstrip("/")
            if project and (started_in == root or started_in.startswith(root + "/")) and project not in stacks:
                stacks.append(project)
        return stacks

    def taken_down(self, stacks: list[str]) -> list[str]:
        """Takes each stack down with its volumes; the names of those that went."""
        gone = []
        for project in stacks:
            try:
                done = subprocess.run(["docker", "compose", "-p", project, "down", "-v", "--remove-orphans"], capture_output=True, text=True, timeout=DOWN_SECONDS)
            except (OSError, subprocess.TimeoutExpired):
                continue
            if done.returncode == 0:
                gone.append(project)
        return gone

    @staticmethod
    def command(stacks: list[str]) -> str:
        return "; ".join(f"docker compose -p {project} down -v" for project in stacks)
