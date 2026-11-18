"""The GitHub token gh is given in a secret run: the project root's .env first, then the journal's own GITHUB_TOKEN, never GH_TOKEN."""

from journal.features.secrets.support.github_token import GithubToken


def test_the_token_comes_from_the_project_roots_dotenv_before_the_environment(tmp_path, monkeypatch):
    monkeypatch.setenv("GITHUB_TOKEN", "from-environment")
    (tmp_path / ".env").write_text("# workspace\nOTHER=1\nGITHUB_TOKEN=from-dotenv\n")
    assert GithubToken(tmp_path).found() == "from-dotenv"


def test_a_quoted_or_exported_token_in_the_dotenv_is_read_without_its_quotes(tmp_path, monkeypatch):
    monkeypatch.delenv("GITHUB_TOKEN", raising=False)
    (tmp_path / ".env").write_text("GITHUB_TOKEN='single'\n")
    assert GithubToken(tmp_path).found() == "single"
    (tmp_path / ".env").write_text('export GITHUB_TOKEN="double"\n')
    assert GithubToken(tmp_path).found() == "double"


def test_the_environment_token_is_used_when_the_dotenv_has_none(tmp_path, monkeypatch):
    monkeypatch.setenv("GITHUB_TOKEN", "from-environment")
    (tmp_path / ".env").write_text("OTHER=1\n")
    assert GithubToken(tmp_path).found() == "from-environment"


def test_gh_token_is_never_a_source_and_nothing_found_is_none(tmp_path, monkeypatch):
    monkeypatch.delenv("GITHUB_TOKEN", raising=False)
    monkeypatch.setenv("GH_TOKEN", "never")
    (tmp_path / ".env").write_text("GH_TOKEN=never\n")
    assert GithubToken(tmp_path).found() is None


def test_a_symlinked_dotenv_is_not_read(tmp_path, monkeypatch):
    monkeypatch.delenv("GITHUB_TOKEN", raising=False)
    (tmp_path / "elsewhere").write_text("GITHUB_TOKEN=elsewhere\n")
    (tmp_path / ".env").symlink_to(tmp_path / "elsewhere")
    assert GithubToken(tmp_path).found() is None
