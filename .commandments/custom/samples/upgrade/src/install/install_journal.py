import shutil


class InstallJournal:
    def copy_code(self, source, target):
        # @righteous architecture_upgrade_LockHeldByCodeReplacementDetector
        shutil.copytree(source, target)
