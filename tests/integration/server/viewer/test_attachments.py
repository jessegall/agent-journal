import json

IMAGE_BYTES = b"\x89PNG\r\n\x1a\nthe cart picture"


def uploaded(server, cookie: str, name: str = "cart.png", data: bytes = IMAGE_BYTES) -> str:
    status, body = server.viewer_upload(f"/api/files?name={name}", cookie, data)
    assert status == 200, (status, body)
    return json.loads(body)["file"]


def test_a_file_is_uploaded_sent_with_a_message_and_read_back_as_the_same_bytes(person_server):
    server, cookie, user = person_server
    pending = uploaded(server, cookie)
    assert server.journal.run(f'message send "see this" --file {pending} --environment main', user).code == 0
    shown = server.journal.run("message show 1", user).text
    assert "text: see this" in shown and "files:" in shown and "cart.png" in shown, shown
    assert server.viewer_download("/api/files/message/1/cart.png", cookie) == (200, IMAGE_BYTES, "image/png")


def test_a_file_is_taken_only_with_the_login_cookie(person_server):
    server, _, _ = person_server
    assert server.viewer_upload("/api/files?name=cart.png", "", IMAGE_BYTES)[0] == 401
    assert server.viewer_download("/api/files/message/1/cart.png", "")[0] == 401


def test_a_name_with_a_path_in_it_is_cut_to_its_last_part(person_server):
    server, cookie, _ = person_server
    pending = uploaded(server, cookie, name="..%2F..%2Fsecret.txt")
    assert pending.endswith("/secret.txt") and ".." not in pending, pending


def test_a_message_names_a_file_that_was_never_uploaded_and_is_refused(person_server):
    server, _, user = person_server
    answer = server.journal.run('message send "see this" --file ffffffffffffffff/ghost.png --environment main', user)
    assert answer.code != 0 and "no uploaded file ffffffffffffffff/ghost.png" in answer.text, answer


def test_a_message_without_files_has_none(person_server):
    server, _, user = person_server
    assert server.journal.run('message send "plain" --environment main', user).code == 0
    assert "cart.png" not in server.journal.run("message show 1", user).text
