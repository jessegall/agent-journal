from dataclasses import replace

from core.modules.processes.models.process import Process
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.progress_listing import ProgressListing
from core.modules.processes.support.run_counts import RunCounts


class RunCountLines:
    """Adds the listings that count a run's tests to how it is started, so a run the queue holds for its count gets
    one by whichever route it was started."""

    def __init__(self, listings: RunCounts, progress: ProgressListing) -> None:
        self.listings, self.progress = listings, progress

    def counted(self, run: ForegroundRun, process: Process) -> ForegroundRun:
        listing = self.progress.listing(process)
        return replace(run, count_line=self.listings.line(process), progress_count_line=listing.line if listing else "",
                       progress_count_position=listing.position if listing else 0, progress_count_pattern=listing.pattern if listing else "")
