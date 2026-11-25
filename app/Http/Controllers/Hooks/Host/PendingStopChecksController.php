<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hooks\Host;

use App\Contracts\Sessions\SessionPolicyReader;
use App\Data\Hooks\PendingStopCheckData;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\StopCheck;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;

/**
 * The stop attempts of the host's own sessions that wait for it to run their conditions, with each frozen condition.
 * The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class PendingStopChecksController
{
    public function __invoke(HostContext $host, SessionPolicyReader $policies): JsonResponse
    {
        $attempts = StopCheck::pendingOf(SessionProcess::unresolvedSessionIdsOn($host->hostId));

        return new JsonResponse(['attempts' => array_map(
            fn (StopCheck $attempt) => PendingStopCheckData::of(
                $attempt,
                $policies->policyFor($attempt->session_id),
            )->toArray(),
            $attempts,
        )]);
    }
}
