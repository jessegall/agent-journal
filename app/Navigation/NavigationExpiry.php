<?php

declare(strict_types=1);

namespace App\Navigation;

use App\Agents\DriverRequestEndings;
use App\Agents\Drivers\Enums\HoldReason;
use App\Agents\Drivers\Enums\RequestOutcome;
use App\Models\Drivers\NavigationRequest;
use App\Navigation\Contracts\NavigationExpiry as NavigationExpiryContract;
use App\Navigation\Enums\NavigationStatus;
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

    public function __construct(private DriverRequestEndings $endings) {}

    public function expireDue(): void
    {
        $due = NavigationRequest::query()
            ->acrossActors()
            ->withAnyState([NavigationStatus::Open, NavigationStatus::Answering])
            ->expiredBefore(CarbonImmutable::now())
            ->withDriverRequestAndRuntime()
            ->lockForUpdate()
            ->limit(self::SWEEP_LIMIT)
            ->get();

        foreach ($due as $navigation) {
            $this->endings->expire($navigation);
            $navigation->driverRequest->fail(RequestOutcome::EntryUnavailable);
            $navigation->runtime->holdFor(HoldReason::None);
        }
    }
}
