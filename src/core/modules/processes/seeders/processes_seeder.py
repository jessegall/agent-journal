from engine.enums.command_category import CommandCategory
from engine.seed.demo import Demo
from engine.seed.seeder import Seeder
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.end_process_part.end_process_part import EndProcessPart
from core.modules.processes.support.part_spec import PartSpec
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.support.output_folder import OutputFolder

REPORT = "collected 3 items\n... [100%]\n3 passed in 0.4s\n"
BUILD = "compiling the cart\ncompiling the checkout\n[ 40%]\n"
LONG_BYTES = 5000


class ProcessesSeeder(Seeder):
    """Runs a finished command with output and a command that is still running, and docks the
    running one above the chat."""

    def __init__(self, folder: OutputFolder) -> None:
        self.folder = folder

    def seed(self, demo: Demo) -> None:
        main = demo.people["main"]
        finished = self.started(demo, "pytest -q tests", "pytest")
        self.folder.write_output(finished, 1, REPORT)
        demo.bus.run(EndProcessPart(finished, 1, 0), main, environment_id=None)
        demo.bus.run(EndProcess(finished, 0, LONG_BYTES, REPORT.count("\n")), main, environment_id=None)
        running = self.started(demo, "make build", "make")
        self.folder.write_output(running, 1, BUILD)
        demo.run(f"dock add processes.output process {running} {demo.environment_flag}", demo.people["user"])

    def started(self, demo: Demo, line: str, program: str) -> int:
        command = StartProcess(demo.people["main"].id, None, line, "/work/demo", CommandCategory.UNKNOWN, 30, [PartSpec(line, program)])
        return demo.bus.run(command, demo.people["main"], environment_id=None).id
