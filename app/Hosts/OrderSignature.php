<?php

declare(strict_types=1);

namespace App\Hosts;

/**
 * The signature a host checks an order by (programs/agent/hostapi/verify.go): an HMAC with the host's order secret
 * over the order's id, sequence, type, process, payload digest and expiry, one to a line.
 */
final readonly class OrderSignature
{
    public static function of(
        string $id,
        int $sequence,
        string $type,
        string $processId,
        string $payload,
        string $expiresAt,
        string $secret,
    ): string {
        $lines = implode("\n", [$id, (string) $sequence, $type, $processId, hash('sha256', $payload), $expiresAt]);

        return hash_hmac('sha256', $lines, $secret);
    }
}
