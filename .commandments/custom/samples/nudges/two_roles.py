from engine.driver.nudge_declaration import NudgeDeclaration
from engine.errors.refusal import Refusal


def refuse_poll(process_id: int) -> None:
    # @sin architecture_drivers_text_names_two_roles
    raise Refusal("output is running", f"a main agent sets a monitor with journal output monitor {process_id}; a helper goes idle")


def refuse_for_the_asking_role(process_id: int) -> None:
    # @righteous architecture_drivers_text_names_two_roles
    raise Refusal("output is running", f"set a monitor with journal output monitor {process_id}")


# @sin architecture_drivers_text_names_two_roles
POLL = NudgeDeclaration("samples.poll", "a main agent sets a monitor; a worker goes idle")
# @righteous architecture_drivers_text_names_two_roles
IDLE = NudgeDeclaration("samples.idle", "go idle: the journal wakes you when it ends")
