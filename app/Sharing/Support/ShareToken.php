<?php

declare(strict_types=1);

namespace App\Sharing\Support;

/**
 * The bearer token of one share: 256 random bits as hexadecimal text, and the SHA-256 digest a share is found by.
 */
final readonly class ShareToken
{
    private const int RANDOM_BYTES = 32;

    public function __construct(
        public string $token,
        public string $digest,
    ) {}

    public static function generate(): self
    {
        $token = bin2hex(random_bytes(self::RANDOM_BYTES));

        return new self($token, self::digestOf($token));
    }

    public static function digestOf(string $token): string
    {
        return hash('sha256', $token);
    }
}
