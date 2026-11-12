import subprocess


class RunnerProgram:
    def run(self, line: list[str]) -> int:
        # @righteous architecture_processes_program_started_outside_the_door
        return subprocess.Popen(line).wait()
