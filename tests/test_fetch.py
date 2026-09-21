import subprocess

from install import fetch, plain, reachable, token


def git(*args, cwd):
    return subprocess.run(["git", "-c", "user.email=t@t", "-c", "user.name=t", *args], cwd=cwd, capture_output=True, text=True, timeout=30, check=True).stdout.strip()


def test_one_funnel_fetches_the_default_branch_a_branch_a_tag_or_a_commit(tmp_path):
    origin = tmp_path / "origin"
    origin.mkdir()
    git("init", "-q", "-b", "main", cwd=origin)
    (origin / "VERSION").write_text("1\n")
    git("add", "-A", cwd=origin)
    git("commit", "-q", "-m", "one", cwd=origin)
    first = git("rev-parse", "HEAD", cwd=origin)
    git("tag", "v1", cwd=origin)
    (origin / "VERSION").write_text("2\n")
    git("commit", "-q", "-am", "two", cwd=origin)
    second = git("rev-parse", "HEAD", cwd=origin)
    git("checkout", "-q", "-b", "side", cwd=origin)
    (origin / "VERSION").write_text("side\n")
    git("commit", "-q", "-am", "side", cwd=origin)
    side = git("rev-parse", "HEAD", cwd=origin)
    git("checkout", "-q", "main", cwd=origin)
    url = origin.as_uri()

    def fetched(ref="", n=[0]):
        n[0] += 1
        into = tmp_path / f"package{n[0]}"
        commit, failed = fetch(into, url, ref)
        return commit, failed, (into / "VERSION").read_text().strip() if not failed else ""

    assert fetched() == (second, "", "2"), "no ref: the default branch"
    assert fetched("side") == (side, "", "side"), "a branch"
    assert fetched("v1") == (first, "", "1"), "a tag"
    assert fetched(first) == (first, "", "1"), "a bare commit"
    commit, failed, _ = fetched("nope")
    assert (commit, bool(failed)) == ("", True), "a ref that does not exist fails with git's words and no commit"


def test_a_private_repository_is_reached_with_the_token_and_the_token_is_never_shown():
    assert reachable("https://github.com/o/r", "s3cret") == "https://x-access-token:s3cret@github.com/o/r", \
        "a GitHub URL is fetched as the token's bearer"
    assert [reachable(url, "s3cret") for url in ("file:///tmp/x", "/a/folder", "git@github.com:o/r.git")] == \
        ["file:///tmp/x", "/a/folder", "git@github.com:o/r.git"], "anything else is left exactly as it is"
    assert reachable("https://github.com/o/r", "") == "https://github.com/o/r", "with no token nothing is rewritten"
    assert plain("fatal: could not read https://x-access-token:s3cret@github.com/o/r", "s3cret") == \
        "fatal: could not read https://x-access-token:the token@github.com/o/r", "a token never appears in what is said"
    assert isinstance(token(), str) is True, "the token is asked of the gh CLI, when it is there"
