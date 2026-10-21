import hashlib

from journal.features.phone.support.infinite_point import InfinitePoint

P = 0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF
LINEAR_COEFFICIENT = P - 3
CONSTANT_COEFFICIENT = 0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B
N = 0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551
G = (0x6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296, 0x4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5)


class P256:
    """The NIST P-256 curve, as version 3 wrote it with no library: adding and multiplying its points, and checking a signature, for push's VAPID keys."""

    @staticmethod
    def added(single: tuple | None, counterpart: tuple | None) -> tuple | None:
        if single is None:
            return counterpart
        if counterpart is None:
            return single
        if single[0] == counterpart[0] and (single[1] + counterpart[1]) % P == 0:
            return None
        if single == counterpart:
            slope = (3 * single[0] * single[0] + LINEAR_COEFFICIENT) * pow(2 * single[1], -1, P) % P
        else:
            slope = (counterpart[1] - single[1]) * pow(counterpart[0] - single[0], -1, P) % P
        x = (slope * slope - single[0] - counterpart[0]) % P
        return x, (slope * (single[0] - x) - single[1]) % P

    @staticmethod
    def scalar_product(scalar: int, point: tuple) -> tuple | None:
        rows: tuple | None = None
        doubled: tuple | None = point
        while scalar:
            if scalar & 1:
                rows = P256.added(rows, doubled)
            doubled = P256.added(doubled, doubled)
            scalar >>= 1
        return rows

    @staticmethod
    def finite_product(scalar: int, point: tuple) -> tuple:
        product = P256.scalar_product(scalar, point)
        if product is None:
            raise InfinitePoint()
        return product

    @staticmethod
    def is_curve_point(public: bytes) -> bool:
        if len(public) != 65 or public[0] != 4:
            return False
        x, y = int.from_bytes(public[1:33], "big"), int.from_bytes(public[33:], "big")
        return x < P and y < P and (y * y - x * x * x - LINEAR_COEFFICIENT * x - CONSTANT_COEFFICIENT) % P == 0

    @staticmethod
    def is_signed(public: bytes, message: bytes, signature: bytes) -> bool:
        r, s = int.from_bytes(signature[:32], "big"), int.from_bytes(signature[32:], "big")
        if not P256.is_curve_point(public) or len(signature) != 64 or not (0 < r < N and 0 < s < N):
            return False
        point = (int.from_bytes(public[1:33], "big"), int.from_bytes(public[33:], "big"))
        digest = int.from_bytes(hashlib.sha256(message).digest(), "big")
        inverse = pow(s, -1, N)
        rows = P256.added(P256.scalar_product(digest * inverse % N, G), P256.scalar_product(r * inverse % N, point))
        return rows is not None and rows[0] % N == r
