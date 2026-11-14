class ShareRunner:
    def answer(self, line_run, repository, row):
        # @sin architecture_viewer_share_session_writes_or_decides
        line_run.run_as(["plan", "start", "1"])
        # @sin architecture_viewer_share_session_writes_or_decides
        repository.save(row)
        # @sin architecture_viewer_share_session_writes_or_decides
        raise ShareRefusal("not mine to decide")

    def total(self, rows):
        # @righteous architecture_viewer_share_session_writes_or_decides
        return len(rows)
