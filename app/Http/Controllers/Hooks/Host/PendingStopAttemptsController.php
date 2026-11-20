<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hooks\Host;

use App\Agents\Contracts\SessionPolicyReader;
use App\Agents\Models\ProcessStart;
use App\Agents\Support\HostContext;
use App\Hooks\Models\StopAttempt;
use App\Http\Data\Hooks\PendingStopAttemptData;
use Illuminate\Http\JsonResponse;

/**
 * The stop attempts of the host's own sessions that wait for it to run their conditions, with each frozen condition.
 * The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class PendingStopAttemptsController
{
    public function __invoke(HostContext $host, SessionPolicyReader $policies): JsonResponse
    {
        $attempts = StopAttempt::pendingOf(ProcessStart::unresolvedSessionIdsOn($host->hostId));

        return new JsonResponse(['attempts' => array_map(
            fn (StopAttempt $attempt) => PendingStopAttemptData::of(
                $attempt,
                $policies->policyFor($attempt->session_id),
            )->toArray(),
            $attempts,
        )]);
    }
}
