<?php

declare(strict_types=1);

namespace App\Api;

use App\Api\Exceptions\ApiFieldInvalid;
use App\Profiles\StartProfilePin;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;

/**
 * The identity of one call an agent makes: its id, when the agent issued it, and the digest of its body.
 * The agent signs the three with its start token, so none of them can change on the way.
 */
final readonly class SignedCall
{
    public const string ID_HEADER = 'X-Journal-Call-Id';

    public const string ISSUED_AT_HEADER = 'X-Journal-Call-Issued-At';

    public const string SIGNATURE_HEADER = 'X-Journal-Call-Signature';

    public const string PROFILE_HEADER = 'X-Journal-Profile';

    public const string PROFILE_REVISION_HEADER = 'X-Journal-Profile-Revision';

    public function __construct(
        public string $callId,
        public CarbonImmutable $issuedAt,
        public string $bodyDigest,
    ) {}

    /**
     * The signature over the envelope, one field per line: method, request target of the url, call id, issue time and
     * digest of the body. A field holding a line break could forge another envelope, so it is refused.
     *
     * @throws ApiFieldInvalid
     */
    public static function signatureFor(
        string $token,
        string $method,
        string $url,
        string $callId,
        int $issuedAt,
        string $body,
    ): string {
        return self::sign($token, self::envelope($method, $url, $callId, $issuedAt, $body));
    }

    /**
     * The signature a request should carry under this token: the envelope over its own method, target and body.
     */
    public static function signatureOfRequest(string $token, Request $request, string $callId, int $issuedAt): string
    {
        $envelope = self::envelope(
            $request->getMethod(),
            $request->getRequestUri(),
            $callId,
            $issuedAt,
            $request->getContent(),
        );

        return self::sign($token, $envelope);
    }

    /**
     * An agent call's signature: the envelope with the start's pinned profile key and revision after it, so a call
     * cannot claim another profile than the one it was started with.
     *
     * @throws ApiFieldInvalid
     */
    public static function agentSignatureFor(
        string $token,
        string $method,
        string $url,
        string $callId,
        int $issuedAt,
        string $body,
        StartProfilePin $profile,
    ): string {
        return self::sign(
            $token,
            [...self::envelope($method, $url, $callId, $issuedAt, $body), $profile->key, (string) $profile->revision],
        );
    }

    /**
     * The request target a call signs: its path and query as they travel, the same for the client and the server.
     */
    public static function targetOf(string $url): string
    {
        $parts = parse_url($url);
        $path = $parts['path'] ?? '/';

        if (isset($parts['query'])) {
            return "{$path}?{$parts['query']}";
        }

        return $path;
    }

    public static function digestOf(string $body): string
    {
        return hash('sha256', $body);
    }

    /**
     * The fields every signed call carries, in order.
     *
     * @return list<string>
     */
    private static function envelope(string $method, string $url, string $callId, int $issuedAt, string $body): array
    {
        return [
            strtoupper($method),
            self::targetOf($url),
            $callId,
            (string) $issuedAt,
            self::digestOf($body),
        ];
    }

    /**
     * @param  list<string>  $fields
     *
     * @throws ApiFieldInvalid
     */
    private static function sign(string $token, array $fields): string
    {
        foreach ($fields as $field) {
            if (str_contains($field, "\n") || str_contains($field, "\r")) {
                throw ApiFieldInvalid::lineBreak();
            }
        }

        return hash_hmac('sha256', implode("\n", $fields), $token);
    }
}
