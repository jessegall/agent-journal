from core.base.agent_checkouts import AgentCheckouts
from engine.checkout.checkout import Checkout
from engine.checkout.checkout_file import CheckoutFile
from engine.enums.checkout_type import CheckoutType
from core.base.file_state import FileState
from engine.enums.file_status import FileStatus


def linked_project(tmp_path):
    project = tmp_path / "project"
    (project / "copies" / "first").mkdir(parents=True)
    link = tmp_path / "linked"
    link.symlink_to(project, target_is_directory=True)
    return project.resolve(), link


def test_a_project_checkout_is_its_own_project_at_its_real_path(tmp_path):
    project, link = linked_project(tmp_path)
    assert Checkout.project_checkout(link, "version-5") == Checkout(CheckoutType.MAIN, project, project, "version-5")


def test_a_copy_names_its_real_root_its_real_project_and_its_branches(tmp_path):
    project, link = linked_project(tmp_path)
    checkout = Checkout.copy_checkout(link / "copies" / "first", link, "journal/main/worker-1", "version-5", "abc123", True)
    assert checkout == Checkout(CheckoutType.WORKTREE, project / "copies" / "first", project, "journal/main/worker-1", "version-5", "abc123", True)


def test_a_copy_whose_folder_is_gone_still_has_a_root_and_says_it_does_not_exist(tmp_path):
    project, link = linked_project(tmp_path)
    checkout = Checkout.copy_checkout(link / "copies" / "gone", link, "journal/main/worker-1", "version-5", "abc123", False)
    assert checkout.root == project / "copies" / "gone" and checkout.exists is False


def first_copy(tmp_path):
    project, link = linked_project(tmp_path)
    return project, link, Checkout.copy_checkout(link / "copies" / "first", link, "journal/main/worker-1", "version-5", "abc123", True)


def test_a_file_in_a_copy_inside_the_project_is_named_from_the_copy_and_never_from_the_project(tmp_path):
    project, link, checkout = first_copy(tmp_path)
    file = CheckoutFile.located(checkout, "src/order.py")
    assert file.relative == "src/order.py" and not file.linked
    assert file.path == f"{project}/copies/first/src/order.py" and file.project_path == f"{project}/src/order.py"


def test_a_file_named_through_a_link_and_by_its_real_path_is_one_file(tmp_path):
    project, link, checkout = first_copy(tmp_path)
    assert CheckoutFile.located(checkout, link / "copies" / "first" / "order.py") == CheckoutFile.located(checkout, project / "copies" / "first" / "order.py")


def test_a_file_under_a_link_in_the_copy_keeps_its_name_and_is_linked(tmp_path):
    project, link, checkout = first_copy(tmp_path)
    (project / "node_modules").mkdir()
    (checkout.root / "node_modules").symlink_to(project / "node_modules", target_is_directory=True)
    file = CheckoutFile.located(checkout, "node_modules/x.js")
    assert file.relative == "node_modules/x.js" and file.linked and file.path == f"{project}/node_modules/x.js"


def test_a_deleted_file_in_a_deleted_folder_still_has_a_name(tmp_path):
    project, link, checkout = first_copy(tmp_path)
    assert CheckoutFile.located(checkout, "gone/order.py").relative == "gone/order.py"


def test_a_file_in_the_project_lies_at_the_same_place_twice(tmp_path):
    project, link = linked_project(tmp_path)
    file = CheckoutFile.located(Checkout.project_checkout(link, "version-5"), "src/order.py")
    assert file.path == file.project_path == f"{project}/src/order.py"


def test_with_nothing_to_ask_a_file_is_changed_or_deleted_and_not_in_the_base(tmp_path):
    project, link = linked_project(tmp_path)
    checkout = Checkout.project_checkout(link, "version-5")
    (project / "here.py").write_text("HERE = 1\n")
    assert AgentCheckouts().file_state(checkout, "here.py") == FileState(FileStatus.CHANGED, False)
    assert AgentCheckouts().file_state(checkout, "gone.py") == FileState(FileStatus.DELETED, False)
