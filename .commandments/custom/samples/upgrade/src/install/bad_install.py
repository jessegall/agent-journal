import shutil


class BadInstall:
    def run(self, source, target):
        # @sin architecture_upgrade_LockHeldByCodeReplacementDetector
        shutil.copytree(source, target)
