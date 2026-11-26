<?php

declare(strict_types=1);

namespace App\Sessions\Contracts;

use App\Api\AgentCallReply;
use App\Api\PreparedAgentCall;
use App\Exceptions\ApiDeadlinePassed;
use App\Exceptions\JournalUnreachable;
use App\Sessions\AgentClientSettings;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\Response;

/**
 * What other Core areas use of the AgentRequests area's AgentRequestClient.
 */
interface AgentRequestClient
{
    /**
     * Sends the body to the journal's path as the agent the settings name, and gives the response.
     */
    public function post(AgentClientSettings $settings, string $path, string $body): Response;

    /**
     * The same call under an id and issue time its caller keeps, so a retry reaches the journal as the same call.
     */
    public function prepareWithId(
        AgentClientSettings $settings,
        string $path,
        string $body,
        string $callId,
        int $issuedAt,
    ): PreparedAgentCall;

    /**
     * Sends the prepared call with extra unsigned headers before the deadline, and returns the answer whatever its
     * status.
     *
     * @param  array<string, string>  $headers
     *
     * @throws ApiDeadlinePassed
     * @throws JournalUnreachable
     */
    public function sendPrepared(PreparedAgentCall $call, array $headers, CarbonImmutable $deadline): AgentCallReply;
}
