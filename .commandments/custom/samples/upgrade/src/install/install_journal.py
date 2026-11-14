import shutil


class InstallJournal:
    def copy_code(self, source, target):
        # @righteous architecture_upgrade_code_replaced_outside_the_steps
        shutil.copytree(source, target)
