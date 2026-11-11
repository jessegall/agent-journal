from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.commit_subject import CommitSubject
from suites.coding.modules.workers.support.task_branch_commit import TaskBranchCommit

CART = Task(id=12, creator_id=1, title="Fix the cart")
TAX = Task(id=15, creator_id=1, title="Add the tax")


def commit(subject: str) -> TaskBranchCommit:
    return TaskBranchCommit("abc1234", subject, None)


def test_the_subject_of_one_task_reads_task_its_id_and_its_title():
    assert CommitSubject(tuple([CART])).text() == "task 12: Fix the cart"


def test_the_subject_of_several_tasks_lists_their_ids_and_carries_the_title_of_the_first():
    assert CommitSubject((CART, TAX)).text() == "tasks 12, 15: Fix the cart"


def test_a_commit_of_several_tasks_carries_each_task_of_its_subject_and_no_task_whose_digits_it_holds():
    several = commit(CommitSubject((CART, TAX)).text())
    assert several.task_ids() == (12, 15)
    assert several.has_task_subject([12]) and several.has_task_subject([15]) and several.has_task_subject([3, 15])
    assert not several.has_task_subject([1]) and not several.has_task_subject([2]) and not several.has_task_subject([5])


def test_a_commit_of_one_task_carries_that_task_and_a_subject_of_no_task_carries_none():
    assert commit("task 12: Fix the cart").has_task_subject([12])
    assert not commit("task 12: Fix the cart").has_task_subject([1])
    assert commit("Merge the cart of task 12: done").task_ids() == ()
