import re
import subprocess

TIME_FORMAT = re.compile(r"^(?:(?P<days>\d+)-)?(?:(?P<hours>\d+):)?(?P<minutes>\d+):(?P<seconds>\d+(?:\.\d+)?)$")
LISTING_SECONDS = 10


class GroupCpuTime:
    """The processor time, in seconds, that every process of a group has used together; a run's runner leads its
    group, so the group is the run's whole process tree. One listing of the machine's processes serves every
    group asked of it."""

    def listing(self) -> str | None:
        try:
            return subprocess.run(["ps", "-axo", "pgid=,time="], capture_output=True, text=True, timeout=LISTING_SECONDS, check=False).stdout
        except (OSError, subprocess.SubprocessError):
            return None

    def seconds(self, listing: str, group: int) -> float | None:
        return self.group_total(listing, group)

    @classmethod
    def group_total(cls, listing: str, group: int) -> float | None:
        cpu_seconds = [cls.parsed(fields[1]) for fields in (line.split() for line in listing.splitlines()) if len(fields) == 2 and fields[0] == str(group)]
        return sum(cpu_seconds) if cpu_seconds else None

    @staticmethod
    def parsed(text: str) -> float:
        match = TIME_FORMAT.match(text)
        if match is None:
            return 0.0
        return int(match["days"] or 0) * 86400 + int(match["hours"] or 0) * 3600 + int(match["minutes"]) * 60 + float(match["seconds"])
