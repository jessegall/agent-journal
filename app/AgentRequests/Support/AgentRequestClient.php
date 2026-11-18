<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

use Carbon\CarbonImmutable;
use Illuminate\Http\Client\Factory;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Str;

/**
 * Posts one call from a launched program to the journal, signed with the launch token: a fresh call id, the time it
 * was issued and the signature over the body's digest.
 */
final readonly class AgentRequestClient
{
    public function __construct(private Factory $http) {}

    public function post(AgentClientSettings $settings, string $path, string $body): Response
    {
        $callId = (string) Str::ulid();
        $issuedAt = CarbonImmutable::now()->getTimestamp();

        return $this->http->timeout($settings->timeoutSeconds)
            ->withToken($settings->token)
            ->withHeaders([
                SignedCall::ID_HEADER => $callId,
                SignedCall::ISSUED_AT_HEADER => (string) $issuedAt,
                SignedCall::SIGNATURE_HEADER => SignedCall::signatureFor($settings->token, $callId, $issuedAt, SignedCall::digestOf($body)),
            ])
            ->withBody($body, 'application/json')
            ->accept('application/json')
            ->post($settings->journalUrl.$path);
    }
}
