from core.base.checkout import Checkout
from core.base.checkout_kind import CheckoutKind


def linked_project(tmp_path):
    project = tmp_path / "project"
    (project / "copies" / "first").mkdir(parents=True)
    link = tmp_path / "linked"
    link.symlink_to(project, target_is_directory=True)
    return project.resolve(), link


def test_a_project_checkout_is_its_own_project_at_its_real_path(tmp_path):
    project, link = linked_project(tmp_path)
    assert Checkout.of_project(link, "version-5") == Checkout(CheckoutKind.MAIN, project, project, "version-5")


def test_a_copy_names_its_real_root_its_real_project_and_its_branches(tmp_path):
    project, link = linked_project(tmp_path)
    checkout = Checkout.of_copy(link / "copies" / "first", link, "journal/main/worker-1", "version-5", "abc123", True)
    assert checkout == Checkout(CheckoutKind.WORKTREE, project / "copies" / "first", project, "journal/main/worker-1", "version-5", "abc123", True)


def test_a_copy_whose_folder_is_gone_still_has_a_root_and_says_it_does_not_exist(tmp_path):
    project, link = linked_project(tmp_path)
    checkout = Checkout.of_copy(link / "copies" / "gone", link, "journal/main/worker-1", "version-5", "abc123", False)
    assert checkout.root == project / "copies" / "gone" and checkout.exists is False
