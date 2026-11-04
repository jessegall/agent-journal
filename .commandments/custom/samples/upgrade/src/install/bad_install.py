import shutil


class BadInstall:
    def run(self, source, target):
        # @sin architecture_upgrade_code_replaced_outside_the_steps
        shutil.copytree(source, target)
