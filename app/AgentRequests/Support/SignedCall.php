<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

use Carbon\CarbonImmutable;

/**
 * The identity of one call an agent makes: its id, when the agent issued it, and the digest of its body.
 * The agent signs the three with its launch token, so none of them can change on the way.
 */
final readonly class SignedCall
{
    public const string ID_HEADER = 'X-Journal-Call-Id';

    public const string ISSUED_AT_HEADER = 'X-Journal-Call-Issued-At';

    public const string SIGNATURE_HEADER = 'X-Journal-Call-Signature';

    public function __construct(
        public string $callId,
        public CarbonImmutable $issuedAt,
        public string $bodyDigest,
    ) {}

    public static function signatureFor(string $token, string $callId, int $issuedAt, string $bodyDigest): string
    {
        return hash_hmac('sha256', "{$callId}\n{$issuedAt}\n{$bodyDigest}", $token);
    }

    public static function digestOf(string $body): string
    {
        return hash('sha256', $body);
    }
}
