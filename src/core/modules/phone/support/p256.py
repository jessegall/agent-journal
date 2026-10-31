import hashlib

from core.modules.phone.support.infinite_point import InfinitePoint

Point = tuple[int, int]
P = 0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF
LINEAR_COEFFICIENT = P - 3
CONSTANT_COEFFICIENT = 0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B
N = 0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551
G = (0x6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296, 0x4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5)
PUBLIC_KEY_BYTES = 65
COORDINATE_BYTES = 32


class P256:
    """The NIST P-256 curve with no library: adding and multiplying its points, and checking a signature, for the
    VAPID keys a web push is signed with."""

    @staticmethod
    def added(single: Point | None, counterpart: Point | None) -> Point | None:
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
    def scalar_product(scalar: int, point: Point) -> Point | None:
        product: Point | None = None
        doubled: Point | None = point
        while scalar:
            if scalar & 1:
                product = P256.added(product, doubled)
            doubled = P256.added(doubled, doubled)
            scalar >>= 1
        return product

    @staticmethod
    def finite_product(scalar: int, point: Point) -> Point:
        product = P256.scalar_product(scalar, point)
        if product is None:
            raise InfinitePoint()
        return product

    @staticmethod
    def is_curve_point(public: bytes) -> bool:
        if len(public) != PUBLIC_KEY_BYTES or public[0] != 4:
            return False
        x, y = int.from_bytes(public[1:33], "big"), int.from_bytes(public[33:], "big")
        return x < P and y < P and (y * y - x * x * x - LINEAR_COEFFICIENT * x - CONSTANT_COEFFICIENT) % P == 0

    @staticmethod
    def is_signed(public: bytes, message: bytes, signature: bytes) -> bool:
        if len(signature) != 2 * COORDINATE_BYTES or not P256.is_curve_point(public):
            return False
        r, s = int.from_bytes(signature[:COORDINATE_BYTES], "big"), int.from_bytes(signature[COORDINATE_BYTES:], "big")
        if not (0 < r < N and 0 < s < N):
            return False
        point = (int.from_bytes(public[1:33], "big"), int.from_bytes(public[33:], "big"))
        digest = int.from_bytes(hashlib.sha256(message).digest(), "big")
        inverse = pow(s, -1, N)
        total = P256.added(P256.scalar_product(digest * inverse % N, G), P256.scalar_product(r * inverse % N, point))
        return total is not None and total[0] % N == r
