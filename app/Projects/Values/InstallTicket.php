<?php

declare(strict_types=1);

namespace App\Projects\Values;

/**
 * The one-time secret of an install line: 32 random bytes as base64url. It lives only in the line shown to the owner
 * and in the URL the line fetches; the journal keeps its digest.
 */
final readonly class InstallTicket
{
    private const int RANDOM_BYTES = 32;

    private function __construct(public string $secret) {}

    public static function generate(): self
    {
        return new self(rtrim(strtr(base64_encode(random_bytes(self::RANDOM_BYTES)), '+/', '-_'), '='));
    }

    /**
     * The stored form of a ticket: its digest, so the ticket itself is never kept.
     */
    public static function digestOf(string $ticket): string
    {
        return hash('sha256', $ticket);
    }

    public function digest(): string
    {
        return self::digestOf($this->secret);
    }
}
