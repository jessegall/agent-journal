from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from suites.coding.modules.workers.support.checkout_libraries import CheckoutLibraries


def project_with_libraries(root):
    (root / "vendor").mkdir(parents=True)
    (root / "vendor" / "autoload.php").write_text("<?php\n")
    (root / "composer.json").write_text("{}\n")
    (root / "node_modules").mkdir()
    (root / "node_modules" / "index.js").write_text("module.exports = 1\n")
    (root / ".env").write_text("DB_HOST=127.0.0.1\n")


def test_a_test_checkout_copies_what_is_named_to_copy_and_composers_vendor_and_links_the_rest(played, tmp_path):
    story = played(OpenTaskOrchestrator)
    source, checkout = tmp_path / "project", tmp_path / "checkout"
    project_with_libraries(source)
    checkout.mkdir()
    (checkout / "vendor").symlink_to(source / "vendor", target_is_directory=True)
    story.container.get(CheckoutLibraries).given(str(source), str(checkout), ["vendor", "node_modules", ".env"], {".env"})
    story.expect_rows((checkout / "vendor").is_dir() and not (checkout / "vendor").is_symlink(), (checkout / "vendor" / "autoload.php").is_file(),
                      (checkout / "node_modules").is_symlink(), (checkout / ".env").read_text() == "DB_HOST=127.0.0.1\n" and not (checkout / ".env").is_symlink())
