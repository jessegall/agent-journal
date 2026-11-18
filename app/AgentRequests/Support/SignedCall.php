<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

use App\AgentRequests\Exceptions\CallFieldInvalid;
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

    public const string PROTOCOL_HEADER = 'X-Journal-Protocol';

    /**
     * The version of the signed envelope this journal reads and writes.
     */
    public const string PROTOCOL = '2';

    public function __construct(
        public string $callId,
        public CarbonImmutable $issuedAt,
        public string $bodyDigest,
    ) {}

    /**
     * The signature over the version-2 envelope, one field per line: protocol, method, request target of the url, call
     * id, issue time and digest of the body. A field holding a line break could forge another envelope, so it is refused.
     *
     * @throws CallFieldInvalid
     */
    public static function signatureFor(string $token, string $method, string $url, string $callId, int $issuedAt, string $body): string
    {
        $fields = [self::PROTOCOL, strtoupper($method), self::targetOf($url), $callId, (string) $issuedAt, self::digestOf($body)];

        foreach ($fields as $field) {
            if (str_contains($field, "\n") || str_contains($field, "\r")) {
                throw CallFieldInvalid::lineBreak();
            }
        }

        return hash_hmac('sha256', implode("\n", $fields), $token);
    }

    /**
     * The request target a call signs: its path and query as they travel, the same for the client and the server.
     */
    public static function targetOf(string $url): string
    {
        $parts = parse_url($url);
        $path = $parts['path'] ?? '/';

        return isset($parts['query']) ? "{$path}?{$parts['query']}" : $path;
    }

    public static function digestOf(string $body): string
    {
        return hash('sha256', $body);
    }
}
