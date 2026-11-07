import subprocess
from dataclasses import dataclass
from pathlib import Path

OPENSSL_TIMEOUT_SECONDS = 30


@dataclass(frozen=True)
class TlsFiles:
    """A self-signed certificate for 127.0.0.1 and its private key, made for one story's shared server."""

    certificate: Path
    key: Path

    @classmethod
    def made_in(cls, folder: Path) -> "TlsFiles":
        files = cls(folder / "server.pem", folder / "server.key")
        subprocess.run(["openssl", "req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", str(files.key), "-out", str(files.certificate), "-days", "1",
                        "-subj", "/CN=127.0.0.1", "-addext", "subjectAltName=IP:127.0.0.1"], check=True, capture_output=True, timeout=OPENSSL_TIMEOUT_SECONDS)
        return files
