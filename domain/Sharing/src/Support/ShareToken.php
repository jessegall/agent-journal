<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

/**
 * The bearer token of one share: 256 random bits as 43 characters of URL-safe base64, and the SHA-256 digest a share
 * is found by.
 */
final readonly class ShareToken
{
    private const int RANDOM_BYTES = 32;

    private const string SHAPE = '/^[A-Za-z0-9_-]{43}$/';

    public function __construct(
        public string $token,
        public string $digest,
    ) {}

    public static function generate(): self
    {
        $token = rtrim(strtr(base64_encode(random_bytes(self::RANDOM_BYTES)), '+/', '-_'), '=');

        return new self($token, self::digestOf($token));
    }

    public static function digestOf(string $token): string
    {
        return hash('sha256', $token);
    }

    /**
     * Whether the text has the shape of a token at all, checked before anything is read.
     */
    public static function hasShape(string $text): bool
    {
        return preg_match(self::SHAPE, $text) === 1;
    }
}
