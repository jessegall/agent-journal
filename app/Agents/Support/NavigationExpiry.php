<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\ExpiresNavigation;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\NavigationState;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Models\NavigationRequest;
use Carbon\CarbonImmutable;

/**
 * Expires the navigation requests nobody answered in time, at most a bounded batch per sweep: each ends its key
 * script request entry_unavailable and releases its runtime.
 */
final readonly class NavigationExpiry implements ExpiresNavigation
{
    /**
     * The most requests one sweep expires; the rest wait for the next pass.
     */
    private const int MOST_PER_SWEEP = 100;

    public function expireDue(): void
    {
        $due = NavigationRequest::query()
            ->acrossActors()
            ->whereIn('state', [NavigationState::Open, NavigationState::Answering])
            ->expiredBefore(CarbonImmutable::now())
            ->with(['driverRequest', 'runtime'])
            ->lockForUpdate()
            ->readLimit(self::MOST_PER_SWEEP)
            ->get();

        foreach ($due as $navigation) {
            $navigation->expire();
            $navigation->driverRequest->fail(RequestOutcome::EntryUnavailable);
            $navigation->runtime->holdFor(HoldReason::None);
        }
    }
}
