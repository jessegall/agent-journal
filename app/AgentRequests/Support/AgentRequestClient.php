<?php

declare(strict_types=1);

namespace App\AgentRequests\Support;

use App\AgentRequests\Exceptions\CallDeadlinePassed;
use App\AgentRequests\Exceptions\JournalUnreachable;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Factory;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Str;

/**
 * Posts calls from a launched program to the journal, signed with the launch token: a call id, the time it was issued
 * and the signature over the body's digest. A prepared call is sent again unchanged on a retry. Redirects are refused
 * and certificates verified.
 */
final readonly class AgentRequestClient
{
    public function __construct(private Factory $http) {}

    public function post(AgentClientSettings $settings, string $path, string $body): Response
    {
        $call = $this->prepare($settings, $path, $body, CarbonImmutable::now()->getTimestamp());

        return $this->request($call, $settings->timeoutSeconds)->post($call->url());
    }

    public function prepare(AgentClientSettings $settings, string $path, string $body, int $issuedAt): PreparedAgentCall
    {
        return $this->prepareWithId($settings, $path, $body, (string) Str::ulid(), $issuedAt);
    }

    /**
     * The same call under an id and issue time its caller keeps, so a retry reaches the journal as the same call.
     */
    public function prepareWithId(AgentClientSettings $settings, string $path, string $body, string $callId, int $issuedAt): PreparedAgentCall
    {
        $signature = SignedCall::signatureFor($settings->token, 'POST', $settings->journalUrl.$path, $callId, $issuedAt, $body);

        return new PreparedAgentCall($settings, $path, $body, $callId, $issuedAt, $signature);
    }

    /**
     * Sends the prepared call with extra unsigned headers before the deadline, and returns the answer whatever its
     * status.
     *
     * @param  array<string, string>  $headers
     *
     * @throws CallDeadlinePassed
     * @throws JournalUnreachable
     */
    public function sendPrepared(PreparedAgentCall $call, array $headers, CarbonImmutable $deadline): AgentCallReply
    {
        $secondsLeft = CarbonImmutable::now()->diffInMilliseconds($deadline, false) / 1000;

        if ($secondsLeft <= 0) {
            throw CallDeadlinePassed::for($call->callId);
        }

        try {
            $response = $this->request($call, $secondsLeft)->withHeaders($headers)->post($call->url());
        } catch (ConnectionException $unreachable) {
            throw JournalUnreachable::at($call->settings->journalUrl, $unreachable);
        }

        return new AgentCallReply($response->status(), $response->headers(), $response->body());
    }

    private function request(PreparedAgentCall $call, int|float $timeoutSeconds): PendingRequest
    {
        return $this->http->timeout($timeoutSeconds)
            ->withoutRedirecting()
            ->withOptions(['verify' => true])
            ->withToken($call->settings->token)
            ->withHeaders($call->headers())
            ->withBody($call->body, 'application/json')
            ->accept('application/json');
    }
}
