import json

IMAGE_BYTES = b"\x89PNG\r\n\x1a\nthe cart picture"


# uploads a file through the viewer and gives the name a message carries it under
def uploaded(server, cookie: str, name: str = "cart.png", data: bytes = IMAGE_BYTES) -> str:
    status, body = server.viewer_upload(f"/api/files?name={name}", cookie, data)
    assert status == 200, (status, body)
    return json.loads(body)["file"]
