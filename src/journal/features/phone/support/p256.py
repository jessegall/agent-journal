import hashlib

P = 0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF
A = P - 3
B = 0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B
N = 0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551
G = (0x6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296, 0x4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5)


class P256:
    """The NIST P-256 curve, as version 3 wrote it with no library: adding and multiplying its points, and checking a signature, for push's VAPID keys."""

    @staticmethod
    def added(one: tuple | None, other: tuple | None) -> tuple | None:
        if one is None:
            return other
        if other is None:
            return one
        if one[0] == other[0] and (one[1] + other[1]) % P == 0:
            return None
        if one == other:
            slope = (3 * one[0] * one[0] + A) * pow(2 * one[1], -1, P) % P
        else:
            slope = (other[1] - one[1]) * pow(other[0] - one[0], -1, P) % P
        x = (slope * slope - one[0] - other[0]) % P
        return x, (slope * (one[0] - x) - one[1]) % P

    @staticmethod
    def times(scalar: int, point: tuple) -> tuple | None:
        found = None
        while scalar:
            if scalar & 1:
                found = P256.added(found, point)
            point = P256.added(point, point)
            scalar >>= 1
        return found

    @staticmethod
    def is_on_curve(public: bytes) -> bool:
        """An uncompressed public key that is a point of the curve."""
        if len(public) != 65 or public[0] != 4:
            return False
        x, y = int.from_bytes(public[1:33], "big"), int.from_bytes(public[33:], "big")
        return x < P and y < P and (y * y - x * x * x - A * x - B) % P == 0

    @staticmethod
    def is_signed(public: bytes, message: bytes, signature: bytes) -> bool:
        """The signature, r then s, is the public key's over the message."""
        r, s = int.from_bytes(signature[:32], "big"), int.from_bytes(signature[32:], "big")
        if not P256.is_on_curve(public) or len(signature) != 64 or not (0 < r < N and 0 < s < N):
            return False
        point = (int.from_bytes(public[1:33], "big"), int.from_bytes(public[33:], "big"))
        digest = int.from_bytes(hashlib.sha256(message).digest(), "big")
        inverse = pow(s, -1, N)
        found = P256.added(P256.times(digest * inverse % N, G), P256.times(r * inverse % N, point))
        return found is not None and found[0] % N == r
