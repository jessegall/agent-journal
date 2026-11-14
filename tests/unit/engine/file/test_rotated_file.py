from engine.file.rotated_file import RotatedFile

LIMIT_BYTES = 10


def test_a_file_past_its_limit_moves_aside_to_one_old_file_replacing_the_older_one(tmp_path):
    log = tmp_path / "server.log"
    for size in (LIMIT_BYTES + 1, LIMIT_BYTES + 2):
        log.write_text("x" * size)
        assert RotatedFile(log, LIMIT_BYTES).rotate()
        assert (tmp_path / "server.log.1").stat().st_size == size and not log.exists()
    assert not (tmp_path / "server.log.2").exists()


def test_a_file_within_its_limit_or_missing_stays(tmp_path):
    log = tmp_path / "server.log"
    assert not RotatedFile(log, LIMIT_BYTES).rotate()
    log.write_text("x" * LIMIT_BYTES)
    assert not RotatedFile(log, LIMIT_BYTES).rotate() and log.exists()
