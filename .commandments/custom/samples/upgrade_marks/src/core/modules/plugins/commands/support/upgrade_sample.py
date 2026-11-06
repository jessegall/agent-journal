class UpgradeMarkSample:
    def keep_mark(self, files, mark):
        files.update_timestamp(mark)
        try:
            self.run_setup()
        # @sin architecture_plugins_mark_left_on_failure
        except Refusal:
            self.clear_new_code()
            raise

    def remove_mark(self, files, mark):
        files.update_timestamp(mark)
        try:
            self.run_setup()
        # @righteous architecture_plugins_mark_left_on_failure
        except Refusal:
            mark.unlink(missing_ok=True)
            raise

    def skip_mark(self):
        try:
            self.run_setup()
        # @righteous architecture_plugins_mark_left_on_failure
        except Refusal:
            self.clear_new_code()
            raise

    def ignore_failure(self, files, mark):
        files.update_timestamp(mark)
        try:
            self.run_setup()
        # @righteous architecture_plugins_mark_left_on_failure
        except Refusal:
            self.clear_new_code()
