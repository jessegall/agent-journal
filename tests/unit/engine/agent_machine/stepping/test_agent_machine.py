from collections.abc import Sequence
from dataclasses import replace

from engine.agent_stack.escalation import Escalation
from engine.agent_stack.need_key import NeedKey
from engine.agent_stack.open_block import OpenBlock
from engine.agent_stack.reason import Reason
from engine.agent_stack.states.ended import Ended
from engine.agent_stack.states.pause_cause import PauseCause
from engine.agent_stack.states.waiting import Waiting
from engine.agent_stack.states.working import Working
from engine.agent_stack.work_reference import WorkReference
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.capabilities import Capabilities
from engine.agent_machine.contracts.capability import Capability
from engine.agent_machine.contracts.grant import Grant
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.contracts.rank_order import RankOrder
from engine.agent_machine.contracts.transform import Transform
from engine.agent_machine.needs.ended_fact import EndedFact
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.needs.pause_fact import PauseFact
from engine.agent_machine.record.question import Question
from engine.agent_machine.record.refusal_counts import RefusalCounts
from engine.agent_machine.record.rewrite import Rewrite
from engine.agent_machine.stepping.agent_machine import FALLBACK_KEY, HANDOVER_KEY, AgentMachine
from engine.agent_machine.stepping.constraints import PAUSE_KEY
from engine.driver.block_condition import BlockCondition
from engine.driver.nudge import Nudge
from engine.enums.capability_part import CapabilityPart
from engine.enums.capability_proof import CapabilityProof
from engine.enums.command_category import CommandCategory
from engine.enums.command_effect import CommandEffect
from engine.enums.condition_outcome import ConditionOutcome
from engine.enums.decision_class import DecisionClass
from engine.enums.escalation_type import EscalationType
from engine.enums.grant_state import GrantState
from engine.enums.grant_type import GrantType
from engine.enums.hook_event_name import HookEventName
from engine.enums.nudge_type import NudgeType
from engine.enums.responder import Responder
from engine.enums.stack_move_type import StackMoveType
from engine.enums.tool_type import ToolType
from engine.enums.transform_slot import TransformSlot
from engine.enums.wait_mode import WaitMode
from engine.enums.wake_move import WakeMove
from engine.enums.work_stop import WorkStop
from engine.enums.work_type import WorkType
from engine.testing.agent_machine.question_samples import QuestionSamples
from engine.testing.agent_machine.stack_samples import SAMPLE_TIME
from engine.testing.agent_machine.view_samples import ViewSamples
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart

ORDER = RankOrder(("safety.all", "files.policies"), ("overview.first", "documents.open", "messages.unread"))
TASK_REFUSAL = Reason("tasks.stop", DecisionClass.HOLD, "", "task 6 is started")
STOP = QuestionSamples.question(HookSamples.stop())
EDIT = QuestionSamples.question(HookSamples.edit("a.py"))
READ = QuestionSamples.question(HookSamples.tool_use("Read", ToolType.READ, ["a.py"], None))
SKILL_READ = QuestionSamples.question(HookSamples.tool_use("Read", ToolType.READ, [".claude/skills/journal/SKILL.md"], None))
CARRIES_EVERYTHING = Capabilities(*(Capability(part, event, CapabilityProof.IMPLEMENTED_HERE) for part in CapabilityPart for event in HookEventName))
PAUSE_TEXT = "The user paused you: only journal commands and reads run until you are resumed; reply in the chat"


def journal_line(line: str, *parts: Sequence[str]) -> Question:
    return QuestionSamples.question(HookSamples.shell(line, *(ShellPart("journal", CommandCategory.JOURNAL, list(arguments)) for arguments in parts)))


WORK_STOPS = {"main": WorkStop.REFUSE_WHILE_WORK_REMAINS, "helper": WorkStop.HANDOVER}


def view(agent_type: str = "main", **changes: object) -> AgentView:
    sample = ViewSamples.view(agent_type, WORK_STOPS[agent_type], has_parent=agent_type != "main")
    return replace(sample, **{"rank_order": ORDER, "program": CARRIES_EVERYTHING, **changes})


def block(nudge_key: str, rank: str, *lifting: str, block_id: int = 3, is_strict: bool = False, scope_stop: bool = True) -> OpenBlock:
    reason = Reason(f"{rank}-key", DecisionClass.HOLD, rank, f"{nudge_key} first", lifting)
    return OpenBlock(nudge_key, block_id, reason, True, scope_stop, True, True, is_strict)


def working(work_type: WorkType = WorkType.TASK, work_remains: bool = True) -> Need:
    return Need(Working(WorkReference(work_type, 6, "task 6"), work_remains, TASK_REFUSAL), "", NeedKey("Working", None, f"{work_type}:6"))


def test_a_stop_with_a_started_task_is_refused_counted_and_checked() -> None:
    record = AgentMachine().step(view(needs=(working(),)), STOP).record
    assert (record.decision.decision_class, record.shown_reason, record.counts.stop_refusals) == (DecisionClass.HOLD, TASK_REFUSAL, 1)
    assert [check.rule for check in record.stop_checks] == ["tasks.stop"]


def test_a_wait_on_top_of_the_work_lets_the_stop_through_and_resets_the_counts() -> None:
    waits = Need(Waiting((), WaitMode.ANY, True, "question 2"), "", NeedKey("Waiting", None, "question:2"))
    record = AgentMachine().step(view(needs=(working(), waits), counts=RefusalCounts(3, 2)), STOP).record
    assert (record.decision.admits(), record.counts) == (True, RefusalCounts(0, 0))


def test_a_helper_stop_on_its_open_job_hands_the_job_in() -> None:
    record = AgentMachine().step(view("helper", needs=(working(WorkType.JOB),)), STOP).record
    assert (record.decision.admits(), record.shown_reason.key, record.shown_reason.handover) == (True, HANDOVER_KEY, WorkReference(WorkType.JOB, 6, "task 6"))


def test_a_block_refuses_an_edit_past_its_grace_and_lets_a_read_through() -> None:
    machine, blocked = AgentMachine(), view(blocks=(block("documents.open", "documents.open"),))
    assert machine.step(blocked, EDIT).record.decision.decision_class is DecisionClass.HOLD
    assert machine.step(blocked, READ).record.decision.admits()


def test_a_strict_block_refuses_a_read_but_never_a_skill_read() -> None:
    machine, blocked = AgentMachine(), view(blocks=(block("overview.first", "overview.first", "journal overview", is_strict=True),))
    assert (machine.step(blocked, READ).record.decision.admits(), machine.step(blocked, SKILL_READ).record.decision.admits()) == (False, True)


def test_the_lifting_command_of_one_block_passes_every_other_block_with_its_arguments_compared() -> None:
    blocks = (block("overview.first", "overview.first", "journal overview", is_strict=True, block_id=1),
              block("documents.open", "documents.open", "journal doc close 41", is_strict=True, block_id=2))
    machine = AgentMachine()
    assert machine.step(view(blocks=blocks), journal_line("journal doc close 41", ("doc", "close", "41"))).record.decision.admits()
    assert not machine.step(view(blocks=blocks), journal_line("journal doc close 42", ("doc", "close", "42"))).record.decision.admits()


def test_a_lifting_command_chained_with_a_write_is_not_exempt() -> None:
    chained = QuestionSamples.question(HookSamples.shell("journal overview && rm a.py", ShellPart("journal", CommandCategory.JOURNAL, ["overview"]),
                                                   ShellPart("rm", CommandCategory.EDIT, ["a.py"])))
    blocked = view(blocks=(block("overview.first", "overview.first", "journal overview", is_strict=True),))
    assert not AgentMachine().step(blocked, chained).record.decision.admits()


def test_every_block_is_judged_and_the_driver_rank_order_picks_the_reason_shown() -> None:
    blocks = (block("messages.unread", "messages.unread", block_id=1), block("overview.first", "overview.first", block_id=2))
    record = AgentMachine().step(view(blocks=blocks), EDIT).record
    assert (record.shown_reason.rank, [reason.rank for reason in record.outranked_reasons]) == ("overview.first", ["messages.unread"])


def plan(tool_grace_uses: int) -> BlockPlan:
    return BlockPlan(Nudge("tasks.unlogged-writes", NudgeType.STEERING, "log your task"), BlockCondition(), "tasks.log-before-more-writes", "tasks.unlogged",
                    tool_grace_uses=tool_grace_uses)



def test_an_open_row_its_need_still_plans_decides_under_the_plans_rank_keys_and_stop_text() -> None:
    stop_plan = replace(plan(0), scope_stop=True, stop_check_key="tasks.log-before-stop", stop_nudge=Nudge("tasks.unlogged-stop", NudgeType.STEERING, "log your task before you stop"))
    row = block("tasks.unlogged-writes", "row-rank")
    shown = AgentMachine().step(view(blocks=(row,), plans=(stop_plan,)), STOP).record.shown_reason
    assert (shown.key, shown.rank, shown.text) == ("tasks.log-before-stop", "tasks.unlogged", "log your task before you stop")

def test_a_plan_without_a_grace_refuses_the_action_that_found_it_and_a_grace_lets_it_through_both_opening_their_row() -> None:
    without_grace, with_grace = AgentMachine().step(view(plans=(plan(0),)), EDIT).record, AgentMachine().step(view(plans=(plan(5),)), EDIT).record
    assert (without_grace.decision.admits(), with_grace.decision.admits()) == (False, True)
    assert len(without_grace.blocks_opened) == len(with_grace.blocks_opened) == 1


class EditPolicy(Policy):
    key = "files.no-edit"
    rank = "files.policies"
    grant_types = [GrantType.REFUSAL_SKIP]

    def refusals(self, question: Question, view: AgentView) -> Sequence[Reason]:
        tool = question.tool()
        return [Reason(self.key, DecisionClass.REFUSE, self.rank, "no edits")] if tool is not None and tool.is_writing_files() else []


class SafeEditPolicy(EditPolicy):
    key = "files.no-edit-safety"
    is_safety = True


def grant(state: GrantState, policy_key: str = "files.no-edit") -> Grant:
    return Grant(9, GrantType.REFUSAL_SKIP, policy_key, 4, 1, "a.py", EDIT.fingerprint(), state, 4, None, "the edit is the task")


def test_a_usable_grant_passes_its_policy_but_a_held_one_and_a_safety_policy_are_never_passed() -> None:
    assert AgentMachine([EditPolicy()]).step(view(grants=(grant(GrantState.CONFIRMED),)), EDIT).record.decision.admits()
    assert not AgentMachine([EditPolicy()]).step(view(grants=(grant(GrantState.HELD),)), EDIT).record.decision.admits()
    assert not AgentMachine([SafeEditPolicy()]).step(view(grants=(grant(GrantState.CONFIRMED, "files.no-edit-safety"),)), EDIT).record.decision.admits()


def test_the_grant_that_passed_a_refusing_policy_is_named_for_the_save_to_spend_and_an_unrefused_action_spends_none() -> None:
    usable = grant(GrantState.CONFIRMED)
    assert AgentMachine([EditPolicy()]).step(view(grants=(usable,)), EDIT).record.spent_grants == (usable,)
    assert AgentMachine([]).step(view(grants=(usable,)), EDIT).record.spent_grants == ()


def paused(agent_type: str = "main", **changes: object) -> AgentView:
    return view(agent_type, facts=(PauseFact(None, (PauseCause(1, 4, SAMPLE_TIME),), PAUSE_TEXT),), **changes)


def test_a_paused_agent_may_answer_with_a_message_and_rest_but_not_edit_or_hand_over() -> None:
    machine = AgentMachine()
    assert machine.step(paused(), EDIT).record.shown_reason.key == PAUSE_KEY
    assert machine.step(paused(blocks=(block("documents.open", "documents.open", is_strict=True),)), journal_line("journal message send hi", ("message", "send", "hi"))).record.decision.admits()
    rest = machine.step(paused("helper", needs=(working(WorkType.JOB),)), STOP).record
    assert (rest.decision.admits(), rest.shown_reason.handover) == (True, None)



def test_a_paused_agent_may_search_but_not_chain_a_search_with_a_write_or_a_journal_command() -> None:
    search = ShellPart("grep", CommandCategory.SEARCH, ["x", "a.py"])
    alone = QuestionSamples.question(HookSamples.shell("grep x a.py", search))
    with_write = QuestionSamples.question(HookSamples.shell("grep x a.py && rm a.py", search, ShellPart("rm", CommandCategory.EDIT, ["a.py"], effects=[CommandEffect.WRITES_FILES])))
    with_journal = QuestionSamples.question(HookSamples.shell("grep x a.py && journal task make t", search, ShellPart("journal", CommandCategory.JOURNAL, ["task", "make", "t"])))
    machine = AgentMachine()
    assert machine.step(paused(), alone).record.decision.admits()
    assert [machine.step(paused(), question).record.shown_reason.key for question in (with_write, with_journal)] == [PAUSE_KEY, PAUSE_KEY]

class RunnerWrap(Transform):
    slot = TransformSlot.RUNNER

    def applied(self, question: Question, view: AgentView) -> Rewrite:
        return Rewrite.replaced({"command": "journal-run 7"}, (TransformSlot.RUNNER,), "wraps the admitted line", question)


def test_a_rewrite_the_program_cannot_carry_becomes_its_fallback_refusal() -> None:
    carried = AgentMachine(transforms=[RunnerWrap()]).step(view(), READ).record
    dropped = AgentMachine(transforms=[RunnerWrap()]).step(view(program=Capabilities()), READ).record
    assert (carried.decision.admits(), carried.rewrite.changed()) == (True, True)
    assert (dropped.shown_reason.key, dropped.rewrite.changed()) == (FALLBACK_KEY, False)


def test_the_same_view_gives_the_same_record() -> None:
    same = view(needs=(working(),), blocks=(block("documents.open", "documents.open"),))
    assert AgentMachine().step(same, STOP).record == AgentMachine().step(same, STOP).record


def test_the_fifth_refused_stop_opens_an_escalation_and_says_who_was_asked() -> None:
    record = AgentMachine().step(view(needs=(working(),), counts=RefusalCounts(4, 0)), STOP).record
    assert record.counts.escalation is not None
    assert record.shown_reason.text.endswith("A person was asked: you may stop and wait for the answer.")



def test_the_fifth_stop_refused_by_a_started_task_names_it_and_the_next_stop_rests_while_new_work_still_refuses() -> None:
    fifth = AgentMachine().step(view(needs=(working(),), counts=RefusalCounts(4, 0)), STOP).record
    escalation = fifth.counts.escalation
    assert not fifth.decision.admits() and escalation is not None and escalation.work_keys == tuple([working().key])
    assert AgentMachine().step(view(needs=(working(),), escalation=escalation), STOP).record.decision.admits()
    assert not AgentMachine().step(view(needs=(working(WorkType.JOB),), escalation=escalation), STOP).record.decision.admits()


def test_a_hold_no_one_can_judge_never_passes_and_asks_a_person_to_repair_it() -> None:
    record = AgentMachine().step(view(blocks=(block("documents.open", "documents.open"),), block_outcomes={3: ConditionOutcome.UNAVAILABLE}), EDIT).record
    assert not record.decision.admits() and record.counts.escalation is not None and record.counts.escalation.escalation_type is EscalationType.REPAIR


def test_the_fifth_stop_refused_by_an_open_row_its_need_still_plans_names_that_row_in_the_escalation() -> None:
    stop_plan = replace(plan(0), scope_stop=True, stop_check_key="tasks.log-before-stop", stop_nudge=Nudge("tasks.unlogged-stop", NudgeType.STEERING, "log your task before you stop"))
    record = AgentMachine().step(view(blocks=(block("tasks.unlogged-writes", "row-rank"),), plans=(stop_plan,), counts=RefusalCounts(4, 0)), STOP).record
    assert record.counts.escalation is not None and record.counts.escalation.block_ids == (3,)

def test_an_open_escalation_defers_the_stop_scope_of_its_blocks() -> None:
    deferred = Escalation(5, EscalationType.STOPS, Responder.PERSON, (3,), (), 5)
    assert AgentMachine().step(view(blocks=(block("messages.unread", "messages.unread"),), escalation=deferred), STOP).record.decision.admits()


def test_a_block_judged_satisfied_closes_and_constrains_nothing() -> None:
    record = AgentMachine().step(view(blocks=(block("documents.open", "documents.open"),), block_outcomes={3: ConditionOutcome.SATISFIED}), EDIT).record
    assert (record.decision.admits(), [closing.block_id for closing in record.blocks_closed]) == (True, [3])


def test_an_ended_agent_gets_ended_on_top_of_its_stack() -> None:
    result = AgentMachine().step(view(facts=(EndedFact(None, "retired", 1),)), Question.none())
    assert isinstance(result.stack.frames[-1].state, Ended)


def test_past_the_depth_limit_a_block_has_no_frame_and_still_refuses() -> None:
    blocks = (block("messages.unread", "messages.unread", block_id=1), block("overview.first", "overview.first", block_id=2))
    result = AgentMachine().step(view(blocks=blocks, depth_limit=1), EDIT)
    assert [frame.need_key.generation for frame in result.stack.frames[1:]] == ["overview.first"]
    assert [reason.rank for reason in (result.record.shown_reason, *result.record.outranked_reasons)] == ["overview.first", "messages.unread"]


def test_a_new_need_enters_its_frame_and_an_ended_one_exits_wherever_it_sits() -> None:
    machine = AgentMachine()
    first = machine.step(view(needs=(working(),)), Question.none())
    second = machine.step(view(stack=first.stack), Question.none())
    assert [move.move_type for move in first.record.moves] == [StackMoveType.SEEDED]
    assert [move.move_type for move in second.record.moves] == [StackMoveType.EXITED]


def test_a_resting_agent_whose_stop_would_be_refused_gets_a_wake_unless_it_is_paused() -> None:
    assert AgentMachine().step(view(needs=(working(),), is_resting=True), Question.none()).wake.wake_move is WakeMove.WRITTEN
    assert AgentMachine().step(paused(needs=(working(),), is_resting=True), Question.none()).wake.wake_move is WakeMove.INHIBITED
