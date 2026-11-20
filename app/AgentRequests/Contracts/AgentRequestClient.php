<?php

declare(strict_types=1);

namespace App\AgentRequests\Contracts;

use App\AgentRequests\Exceptions\CallDeadlinePassed;
use App\AgentRequests\Exceptions\JournalUnreachable;
use App\AgentRequests\Support\AgentCallReply;
use App\AgentRequests\Support\AgentClientSettings;
use App\AgentRequests\Support\PreparedAgentCall;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\Response;

/**
 * What other Core areas use of the AgentRequests area's AgentRequestClient.
 */
interface AgentRequestClient
{
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
     * @throws CallDeadlinePassed
     * @throws JournalUnreachable
     */
    public function sendPrepared(PreparedAgentCall $call, array $headers, CarbonImmutable $deadline): AgentCallReply;
}
