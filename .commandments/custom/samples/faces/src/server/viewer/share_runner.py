class ShareRunner:
    def answer(self, line_run, repository, row):
        # @sin architecture_viewer_ShareSessionNeverRunsDetector
        line_run.run_as(["plan", "start", "1"])
        # @sin architecture_viewer_ShareSessionNeverRunsDetector
        repository.save(row)
        # @sin architecture_viewer_ShareSessionNeverRunsDetector
        raise ShareRefusal("not mine to decide")

    def total(self, rows):
        # @righteous architecture_viewer_ShareSessionNeverRunsDetector
        return len(rows)
