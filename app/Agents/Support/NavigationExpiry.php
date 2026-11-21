<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\NavigationExpiry as NavigationExpiryContract;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\NavigationState;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Models\NavigationRequest;
use Carbon\CarbonImmutable;

/**
 * Expires the navigation requests nobody answered in time, at most a bounded batch per sweep: each ends its key
 * script request entry_unavailable and releases its runtime.
 */
final readonly class NavigationExpiry implements NavigationExpiryContract
{
    /**
     * The most requests one sweep expires; the rest wait for the next pass.
     */
    private const int SWEEP_LIMIT = 100;

    public function expireDue(): void
    {
        $due = NavigationRequest::query()
            ->acrossActors()
            ->whereIn('state', [NavigationState::Open, NavigationState::Answering])
            ->expiredBefore(CarbonImmutable::now())
            ->with(['driverRequest', 'runtime'])
            ->lockForUpdate()
            ->limit(self::SWEEP_LIMIT)
            ->get();

        foreach ($due as $navigation) {
            $navigation->expire();
            $navigation->driverRequest->fail(RequestOutcome::EntryUnavailable);
            $navigation->runtime->holdFor(HoldReason::None);
        }
    }
}
