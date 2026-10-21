import json
from pathlib import Path


class LaunchResume:
    """The launch file's record of which conversation the agent resumes, kept current so a supervisor started again picks it up."""

    @staticmethod
    def record(path: Path, resume: tuple[str, ...]) -> None:
        if not path.is_file():
            return
        data = json.loads(path.read_text())
        data["front"]["resume"] = list(resume)
        path.write_text(json.dumps(data))
